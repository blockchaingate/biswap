import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { filter, map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

/** Connection lifecycle states */
export type ConnectionState = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed';

/** Client options (tweak as you like) */
export interface CoolConnectOptions {
  urlBase?: string;            // base WS URL (no trailing slash)
  heartbeatMs?: number;        // send a ping every N ms
  idleTimeoutMs?: number;      // if no message for N ms, recycle socket
  backoffInitialMs?: number;   // first reconnect delay
  backoffMaxMs?: number;       // max reconnect delay
  keepAlive?: boolean;         // keep socket alive even with 0 subscribers
}

const DEFAULTS: Required<CoolConnectOptions> = {
  urlBase: 'wss://api.pay.cool/ws',
  heartbeatMs: 25000,
  idleTimeoutMs: 60000,
  backoffInitialMs: 800,
  backoffMaxMs: 30000,
  keepAlive: true,
};

let _deviceId = '';
let _opts: Required<CoolConnectOptions> = { ...DEFAULTS };

let _socket: WebSocketSubject<any> | null = null;
let _messages$: Observable<any> | null = null;
let _subCount = 0;

const _status$ = new BehaviorSubject<ConnectionState>('idle');
const _rawIn$ = new Subject<any>();
const _stop$ = new Subject<void>();

let _hbTimer: any = null;
let _idleTimer: any = null;
let _lastMessageAt = 0;

let _backoff = _opts.backoffInitialMs;

/** Pending request map for sendRequest() */
type Pending = { resolve: (v: any) => void; reject: (e: any) => void; timeout: any };
const _pending = new Map<string, Pending>();

/** Utility */
const now = () => Date.now();
const jitter = (ms: number) => ms + Math.floor(Math.random() * Math.min(1000, ms * 0.2));
const setState = (s: ConnectionState) => _status$.next(s);

/** Create / get the shared connection (parsed JSON objects) */
export function createConnection(deviceId: string, options?: CoolConnectOptions): Observable<any> {
  if (!deviceId) throw new Error('deviceId is required for cool-connect');
  _deviceId = deviceId;
  _opts = { ...DEFAULTS, ...(options || {}) };

  if (_messages$) return _messages$;

  // Multicast message stream parsed as objects
  _messages$ = _rawIn$.pipe(
    // only emit if socket is open/reconnecting to avoid noise
    filter(() => _status$.value === 'open' || _status$.value === 'reconnecting'),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Start the socket immediately (or on first subscribe if you prefer)
  connect();

  return _messages$;
}

/** Close down the connection (will auto-reconnect later if createConnection called again) */
export function closeConnection(): void {
  _stop$.next();
  clearTimers();
  if (_socket) {
    try { _socket.complete(); } catch { }
  }
  _socket = null;
  _messages$ = null;
  _subCount = 0;
  setState('closed');
}

/** Whether the underlying WS is open right this instant */
export function isConnected(): boolean {
  return _status$.value === 'open';
}

/** Connection status observable (UI can show a tiny dot) */
export function connectionState$(): Observable<ConnectionState> {
  return _status$.asObservable();
}

/** Get wallet address from paired app (fire-and-forget message) */
export function getWalletAddress(appName: string): void {
  send({ type: 'getAddress', source: `${appName}-get`, data: appName });
}

/** Send a message (queued if not yet connected) */
export function send(payload: any): void {
  enqueueOrSend(payload);
}

/** Send a message and wait for correlated response (requestId). Auto-attaches requestId if missing. */
export function sendRequest(payload: any, timeoutMs = 60000): Promise<any> {
  const reqId = payload?.requestId || makeReqId();
  const msg = { ...payload, requestId: reqId };

  return new Promise<any>((resolve, reject) => {
    const timeout = setTimeout(() => {
      _pending.delete(reqId);
      reject(new Error('cool-connect: request timeout'));
    }, timeoutMs);

    _pending.set(reqId, { resolve, reject, timeout });
    enqueueOrSend(msg);
  });
}

/** (Optional) expose raw socket for low-level debugging */
export function getSocket(): WebSocketSubject<any> | null {
  return _socket;
}

/* -------------------- internals -------------------- */

function connect() {
  if (!_deviceId) throw new Error('cool-connect: no deviceId set');
  const url = `${_opts.urlBase}/paycool@${_deviceId}`;

  // Tear down existing
  if (_socket) {
    try { _socket.complete(); } catch { }
    _socket = null;
  }

  setState(_status$.value === 'idle' ? 'connecting' : 'reconnecting');

  _socket = webSocket({
    url,
    deserializer: (e: MessageEvent<any>) => {
      try { return JSON.parse((e as any).data); } catch { return (e as any).data; }
    },
    serializer: (v: any) => JSON.stringify(v),
    openObserver: { next: () => onOpen() },
    closeObserver: { next: () => onClose() }
  });

  // Stream subscription
  _socket.pipe(takeUntil(_stop$)).subscribe({
    next: (msg) => onMessage(msg),
    error: (_err) => scheduleReconnect(),
    complete: () => scheduleReconnect()
  });
}

function onOpen() {
  _backoff = _opts.backoffInitialMs;
  setState('open');
  _lastMessageAt = now();
  startHeartbeat();
  flushQueue();
}

function onClose() {
  clearTimers();
  // If we intentionally called closeConnection(), do not reconnect
  if (_status$.value === 'closed') return;
  scheduleReconnect();
}

/** Reconnect with exp. backoff */
function scheduleReconnect() {
  if (_status$.value === 'closed') return;
  setState('reconnecting');
  clearTimers();

  const wait = jitter(_backoff);
  _backoff = Math.min(_opts.backoffMaxMs, Math.max(_opts.backoffInitialMs, _backoff * 2));

  const sub = timer(wait).pipe(takeUntil(_stop$)).subscribe({
    next: () => { sub.unsubscribe(); connect(); }
  });
}

function onMessage(msg: any) {
  _lastMessageAt = now();
  // Resolve pending requests by requestId (if present)
  const reqId = msg?.requestId;
  if (reqId && _pending.has(reqId)) {
    const p = _pending.get(reqId)!;
    clearTimeout(p.timeout);
    _pending.delete(reqId);
    p.resolve(msg);
    // still forward to stream for anyone else interested
  }

  // Also surface generic tx events (wallet may push uncorrelated notices)
  _rawIn$.next(msg);
}

function startHeartbeat() {
  clearTimers();
  // Send pings; also recycle if idle too long
  _hbTimer = setInterval(() => {
    if (_status$.value !== 'open') return;
    try { _socket?.next({ type: 'ping', ts: now() }); } catch { }
  }, _opts.heartbeatMs);

  _idleTimer = setInterval(() => {
    if (_status$.value !== 'open') return;
    if (now() - _lastMessageAt > _opts.idleTimeoutMs) {
      // force recycle to avoid half-open
      try { _socket?.complete(); } catch { }
    }
  }, Math.max(5000, _opts.idleTimeoutMs / 2));
}

function clearTimers() {
  if (_hbTimer) clearInterval(_hbTimer), _hbTimer = null;
  if (_idleTimer) clearInterval(_idleTimer), _idleTimer = null;
}

/** Outgoing queue: holds messages while not open */
const _outQueue: any[] = [];
function enqueueOrSend(msg: any) {
  if (!_socket || _status$.value !== 'open') {
    _outQueue.push(msg);
    if (!_socket || _status$.value === 'closed') connect();
    return;
  }
  try { _socket.next(msg); } catch { _outQueue.push(msg); scheduleReconnect(); }
}

function flushQueue() {
  while (_outQueue.length && _status$.value === 'open') {
    const m = _outQueue.shift();
    try { _socket?.next(m); } catch { _outQueue.unshift(m); break; }
  }
}

function makeReqId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
