import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { filter, shareReplay, takeUntil } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

/** Connection lifecycle states */
export type ConnectionState = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed';

export type WebSocketCtor = new (url: string, protocols?: string | string[]) => any;

/** Client options (tweak as you like) */
export interface WalletConnConnectOptions {
  urlBase?: string;            // base WS URL (no trailing slash), e.g. ws://host/ws
  heartbeatMs?: number;        // send a ping every N ms
  idleTimeoutMs?: number;      // if no message for N ms, recycle socket
  backoffInitialMs?: number;   // first reconnect delay
  backoffMaxMs?: number;       // max reconnect delay
  keepAlive?: boolean;         // keep socket alive even with 0 subscribers
  enableLogging?: boolean;     // toggle verbose client logs
  appId?: string;              // backend appId (dappId)
  role?: 'dapp' | 'wallet';    // role for this client
  scopes?: string[];           // scopes requested for this connection
  roomId?: string;             // roomId (defaults to deviceId)
  walletAddress?: string;      // wallet address for direct connection (optional)
  webSocketCtor?: WebSocketCtor; // override for Node/React Native
}

export interface WalletConnHealthSnapshot {
  state: ConnectionState;
  connected: boolean;
  deviceId: string;
  appId: string;
  roomId: string;
  walletAddress?: string;
  scopes: string[];
  lastActivityAt: number;
  idleForMs: number;
  pendingCount: number;
  queuedCount: number;
  subscriberCount: number;
  manualClose: boolean;
  upgrading: boolean;
  backoffMs: number;
}

export interface WalletConnConnectClient {
  messages$: Observable<any>;
  connectionState$: Observable<ConnectionState>;
  connect: () => void;
  close: () => void;
  isConnected: () => boolean;
  forceReconnect: () => void;
  send: (payload: any) => void;
  sendRequest: (payload: any, timeoutMs?: number) => Promise<any>;
  getWalletAddress: (appName: string, chain?: string) => Promise<any>;
  getSocket: () => WebSocketSubject<any> | null;
  getState: () => ConnectionState;
  getHealthSnapshot: () => WalletConnHealthSnapshot;
}

type InternalOptions = {
  urlBase: string;
  heartbeatMs: number;
  idleTimeoutMs: number;
  backoffInitialMs: number;
  backoffMaxMs: number;
  keepAlive: boolean;
  enableLogging: boolean;
  appId: string;
  role: 'dapp' | 'wallet';
  scopes: string[];
  roomId: string;
  webSocketCtor: WebSocketCtor | null;
  walletAddress?: string; // Optional wallet address for direct connection
};

const DEFAULTS: InternalOptions = {
  urlBase: 'ws://localhost:3000/ws',
  heartbeatMs: 25000,
  idleTimeoutMs: 60000,
  backoffInitialMs: 800,
  backoffMaxMs: 30000,
  keepAlive: true,
  enableLogging: true,
  appId: '',
  role: 'dapp',
  scopes: ['sendTransaction', 'login'],
  roomId: '',
  webSocketCtor: null,
};

/** Pending request map for sendRequest() */
type Pending = {
  resolve: (v: any) => void;
  reject: (e: any) => void;
  timeout: any;
  timeoutMs: number;
  started: boolean;
};

/** Utility */
const now = () => Date.now();
const jitter = (ms: number) => ms + Math.floor(Math.random() * Math.min(1000, ms * 0.2));
const normalizeScopes = (list: string[] = []) =>
  Array.from(new Set(list.map((s) => s.trim()).filter(Boolean))).sort();

export function createClient(deviceId: string, options?: WalletConnConnectOptions): WalletConnConnectClient {
  if (!deviceId) throw new Error('deviceId is required for walletconnconnect');

  let _deviceId = deviceId;
  let _opts: InternalOptions = { ...DEFAULTS, ...(options || {}) } as InternalOptions;
  _opts.scopes = normalizeScopes(_opts.scopes);

  let _socket: WebSocketSubject<any> | null = null;
  let _connectInFlight: Promise<void> | null = null;
  let _hbTimer: any = null;
  let _idleTimer: any = null;
  let _lastActivityAt = 0;
  let _backoff = _opts.backoffInitialMs;
  let _manualClose = false;
  let _subscriberCount = 0;

  const _pending = new Map<string, Pending>();
  const _outQueue: any[] = [];

  const _status$ = new BehaviorSubject<ConnectionState>('idle');
  const _rawIn$ = new Subject<any>();
  const _stop$ = new Subject<void>();

  const setState = (s: ConnectionState) => _status$.next(s);
  const getState = () => _status$.value;
  const logEnabled = () => _opts.enableLogging;
  const log = {
    debug: (...args: any[]) => { if (logEnabled()) console.debug(...args); },
    info: (...args: any[]) => { if (logEnabled()) console.log(...args); },
    warn: (...args: any[]) => { if (logEnabled()) console.warn(...args); },
    error: (...args: any[]) => { console.error(...args); },
    trace: (...args: any[]) => { if (logEnabled()) console.trace(...args); },
  };

  const source$ = new Observable<any>((subscriber) => {
    _subscriberCount += 1;
    if (!_manualClose && !_opts.keepAlive) {
      connect();
    }

    const sub = _rawIn$.subscribe(subscriber);
    return () => {
      sub.unsubscribe();
      _subscriberCount = Math.max(0, _subscriberCount - 1);
      if (!_opts.keepAlive && _subscriberCount === 0 && _pending.size === 0 && _outQueue.length === 0) {
        closeInternal(false);
      }
    };
  });

  const messages$ = source$.pipe(
    filter(() => _status$.value === 'open' || _status$.value === 'reconnecting'),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  if (_opts.keepAlive) {
    connect();
  }

  function connect() {
    if (_connectInFlight) return;
    if (!_deviceId) throw new Error('walletconnconnect: no deviceId set');
    if (!_opts.appId) throw new Error('walletconnconnect: appId is required');
    if (_status$.value === 'open' && _socket) {
      log.info('[walletconnconnect] Connection already open, skipping connect');
      return;
    }

    _manualClose = false;
    _connectInFlight = (async () => {
      // Use walletAddress-appId room if available (direct connection)
      // Otherwise use deviceId-appId room (two-phase connection)
      const roomId = _opts.walletAddress
        ? `${_opts.walletAddress}-${_opts.appId}`
        : `${_deviceId}-${_opts.appId}`;
      const scopes = normalizeScopes(_opts.scopes);
      const role = _opts.role;

      if (!scopes.length) {
        throw new Error('walletconnconnect: at least one scope is required');
      }

      const url = buildWsUrl(_opts.urlBase, roomId, {
        appId: _opts.appId,
        deviceId: _deviceId,
        role,
        scopes,
        walletAddress: _opts.walletAddress,
      });

      log.info('[walletconnconnect] Connecting to:', url);
      log.info('[walletconnconnect] Parameters:', {
        appId: _opts.appId,
        deviceId: _deviceId,
        role,
        scopes,
        roomId
      });

      // Tear down existing
      if (_socket) {
        try { _socket.complete(); } catch { }
        _socket = null;
      }

      setState(_status$.value === 'idle' ? 'connecting' : 'reconnecting');

      const wsConfig: any = {
        url,
        deserializer: (e: any) => {
          try { return JSON.parse((e as any).data); } catch { return (e as any).data; }
        },
        serializer: (v: any) => JSON.stringify(v),
        openObserver: { next: () => onOpen() },
        closeObserver: { next: (e: any) => onClose(e) },
      };
      if (_opts.webSocketCtor) {
        wsConfig.WebSocketCtor = _opts.webSocketCtor as any;
      }

      _socket = webSocket(wsConfig);

      _socket.pipe(takeUntil(_stop$)).subscribe({
        next: (msg) => onMessage(msg),
        error: () => scheduleReconnect(),
        complete: () => scheduleReconnect(),
      });
    })().catch((err) => {
      log.error('walletconnconnect: failed to establish websocket', err);
      setState('closed');
    }).finally(() => {
      _connectInFlight = null;
    });
  }

  function closeInternal(manual: boolean) {
    if (manual) {
      log.trace('[walletconnconnect] closeInternal called (manual=true)');
      _manualClose = true;
    }
    _stop$.next();
    clearTimers();
    if (manual) {
      rejectAllPending(new Error('walletconnconnect: connection closed'));
      _outQueue.length = 0;
    }

    if (_socket) {
      try { _socket.complete(); } catch { }
    }
    _socket = null;
    setState('closed');
  }

  function close() {
    log.trace('[walletconnconnect] Public .close() called');
    closeInternal(true);
  }

  function rejectAllPending(err: Error) {
    _pending.forEach((p) => {
      clearTimeout(p.timeout);
      p.reject(err);
    });
    _pending.clear();
  }

  function onOpen() {
    log.info('[walletconnconnect] WebSocket OPEN');
    _backoff = _opts.backoffInitialMs;
    setState('open');
    _lastActivityAt = now();
    startHeartbeat();
    flushQueue();
  }

  function onClose(event?: CloseEvent) {
    log.info(`[walletconnconnect] WebSocket CLOSED. Code: ${event?.code}, Reason: ${event?.reason}, WasClean: ${event?.wasClean}`);
    clearTimers();
    if (_status$.value === 'closed' || _manualClose) return;
    scheduleReconnect();
  }

  /** Reconnect with exp. backoff */
  function scheduleReconnect() {
    if (_status$.value === 'closed' || _manualClose) return;
    log.info('[walletconnconnect] Scheduling reconnect...');
    setState('reconnecting');
    clearTimers();

    const wait = jitter(_backoff);
    _backoff = Math.min(_opts.backoffMaxMs, Math.max(_opts.backoffInitialMs, _backoff * 2));

    const sub = timer(wait).pipe(takeUntil(_stop$)).subscribe({
      next: () => { sub.unsubscribe(); connect(); }
    });
  }

  function onMessage(msg: any) {
    // log.debug('[walletconnconnect] Raw Message Received:', JSON.stringify(msg));
    _lastActivityAt = now();

    // Handle wallet-address-announce: Wallet sends its address for room upgrade
    if (msg?.type === 'wallet-address-announce') {
      const walletAddress = msg.walletAddress || msg.data?.walletAddress;
      if (walletAddress && !_opts.walletAddress) {
        log.info(`[walletconnconnect] Wallet address announced: ${walletAddress}. Upgrading room...`);
        upgradeRoom(walletAddress);
      }
    }

    // Handle room-upgraded: Server confirms room upgrade
    if (msg?.type === 'room-upgraded') {
      if (msg.success) {
        log.info(`[walletconnconnect] Room upgraded successfully to: ${msg.roomId}`);
        _upgrading = false;
      } else {
        log.error(`[walletconnconnect] Room upgrade failed: ${msg.error}`);
        _upgrading = false;
      }
    }

    const reqId = msg?.requestId;
    if (reqId && _pending.has(reqId)) {
      const p = _pending.get(reqId)!;
      clearTimeout(p.timeout);
      _pending.delete(reqId);
      p.resolve(msg);
    }

    _rawIn$.next(msg);
  }

  /** Upgrade from deviceId-appId room to walletAddress-appId room */
  let _upgrading = false;
  function upgradeRoom(walletAddress: string) {
    if (!walletAddress || _upgrading) return;

    _upgrading = true;
    log.info(`[walletconnconnect] Requesting room upgrade to walletAddress: ${walletAddress}`);

    // Send upgrade request to server
    send({
      type: 'upgrade-room',
      walletAddress: walletAddress
    });

    // Update internal state
    _opts.walletAddress = walletAddress;
    // Server moves this connection to the new room; no reconnect required.
    setTimeout(() => {
      if (_upgrading) {
        _upgrading = false;
      }
    }, 10000);
  }

  function startHeartbeat() {
    clearTimers();

    const canHeartbeat = _opts.scopes.includes('sendTransaction');
    if (canHeartbeat && _opts.heartbeatMs > 0) {
      _hbTimer = setInterval(() => {
        if (_status$.value !== 'open') return;
        try {
          _socket?.next({ type: 'status-update', ts: now(), status: 'heartbeat' });
          _lastActivityAt = now();
        } catch { }
      }, _opts.heartbeatMs);
    }

    if (_opts.idleTimeoutMs > 0) {
      _idleTimer = setInterval(() => {
        if (_status$.value !== 'open') return;
        if (now() - _lastActivityAt > _opts.idleTimeoutMs) {
          try { _socket?.complete(); } catch { }
        }
      }, Math.max(5000, _opts.idleTimeoutMs / 2));
    }
  }

  function clearTimers() {
    if (_hbTimer) clearInterval(_hbTimer), _hbTimer = null;
    if (_idleTimer) clearInterval(_idleTimer), _idleTimer = null;
  }

  function enqueueOrSend(msg: any) {
    if (_manualClose) {
      log.warn('walletconnconnect: send ignored because connection is closed');
      return;
    }

    if (!_socket || _status$.value !== 'open') {
      _outQueue.push(msg);
      if (!_socket || _status$.value === 'closed') connect();
      return;
    }

    try {
      _socket.next(msg);
      _lastActivityAt = now();
      maybeStartTimeout(msg);
    } catch {
      _outQueue.push(msg);
      scheduleReconnect();
    }
  }

  function flushQueue() {
    while (_outQueue.length && _status$.value === 'open') {
      const m = _outQueue.shift();
      try {
        _socket?.next(m);
        _lastActivityAt = now();
        maybeStartTimeout(m);
      } catch {
        _outQueue.unshift(m);
        break;
      }
    }
  }

  function maybeStartTimeout(msg: any) {
    const reqId = msg?.requestId;
    if (!reqId) return;
    const p = _pending.get(reqId);
    if (!p || p.started) return;

    p.started = true;
    p.timeout = setTimeout(() => {
      _pending.delete(reqId);
      p.reject(new Error('walletconnconnect: request timeout'));
    }, p.timeoutMs);
  }

  function makeReqId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function send(payload: any) {
    enqueueOrSend(payload);
  }

  function sendRequest(payload: any, timeoutMs = 60000): Promise<any> {
    if (!payload || typeof payload !== 'object') {
      return Promise.reject(new Error('walletconnconnect: payload must be an object'));
    }
    if (!payload.type || typeof payload.type !== 'string') {
      return Promise.reject(new Error('walletconnconnect: payload.type is required'));
    }
    if (_manualClose) {
      return Promise.reject(new Error('walletconnconnect: connection is closed'));
    }

    const reqId = payload?.requestId || makeReqId();
    const msg = { ...payload, requestId: reqId };

    return new Promise<any>((resolve, reject) => {
      _pending.set(reqId, { resolve, reject, timeout: null, timeoutMs, started: false });
      enqueueOrSend(msg);
    });
  }

  function getWalletAddress(appName: string, chain = 'KANBAN'): Promise<any> {
    return sendRequest(
      { type: 'login-challenge', source: `${appName}-login`, data: { action: 'getAddress', app: appName, chain } },
      30000
    ).catch((err) => {
      log.warn('walletconnconnect: failed to request wallet address', err);
      return null;
    });
  }

  function isConnected(): boolean {
    return _status$.value === 'open';
  }

  function forceReconnect(): void {
    if (!_deviceId) {
      log.warn('walletconnconnect: cannot reconnect without deviceId');
      return;
    }

    if (_status$.value === 'open') {
      log.info('walletconnconnect: connection already open, no need to force reconnect');
      return;
    }

    log.info('walletconnconnect: forcing reconnection...');
    clearTimers();
    _backoff = _opts.backoffInitialMs;
    connect();
  }

  function getSocket(): WebSocketSubject<any> | null {
    return _socket;
  }

  function getEffectiveRoomId(): string {
    return _opts.walletAddress
      ? `${_opts.walletAddress}-${_opts.appId}`
      : `${_deviceId}-${_opts.appId}`;
  }

  function getHealthSnapshot(): WalletConnHealthSnapshot {
    const lastActivityAt = _lastActivityAt;
    return {
      state: _status$.value,
      connected: _status$.value === 'open',
      deviceId: _deviceId,
      appId: _opts.appId,
      roomId: getEffectiveRoomId(),
      walletAddress: _opts.walletAddress,
      scopes: [..._opts.scopes],
      lastActivityAt,
      idleForMs: lastActivityAt ? now() - lastActivityAt : -1,
      pendingCount: _pending.size,
      queuedCount: _outQueue.length,
      subscriberCount: _subscriberCount,
      manualClose: _manualClose,
      upgrading: _upgrading,
      backoffMs: _backoff,
    };
  }

  return {
    messages$,
    connectionState$: _status$.asObservable(),
    connect,
    close,
    isConnected,
    forceReconnect,
    send,
    sendRequest,
    getWalletAddress,
    getSocket,
    getState,
    getHealthSnapshot,
  };
}

function buildWsUrl(base: string, roomId: string, params: {
  appId: string;
  deviceId: string;
  role: string;
  scopes: string[];
  walletAddress?: string;
}) {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const qs = new URLSearchParams({
    appId: params.appId,
    device_id: params.deviceId,
    role: params.role,
    scopes: params.scopes.join(','),
  });
  if (params.walletAddress) {
    qs.set('walletAddress', params.walletAddress);
  }
  return `${cleanBase}/walletconn@${encodeURIComponent(roomId)}?${qs.toString()}`;
}
