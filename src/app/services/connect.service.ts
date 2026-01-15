import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Web3Abi from 'web3-eth-abi';
import BigNumber from 'bignumber.js';
import {
  createClient,
  ConnectionState,
  WalletConnConnectClient,
  WalletConnHealthSnapshot,
} from './walletconn.service';
import { LoggerService } from './logger.service';
import { environment } from '../../environments/environment';
import { UserStateService } from './user-state.service';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';
// import { WalletMessage } from '../models/wallet.model';

type Tx = { to: string; data: string };

@Injectable({ providedIn: 'root' })
export class ConnectService {
  readonly currentTxid = new BehaviorSubject<string>('');
  readonly currentAddress = new BehaviorSubject<string>('');
  readonly connectionState = new BehaviorSubject<ConnectionState>('idle');
  // readonly currentUser = new BehaviorSubject<any>(null); // Moved to UserStateService
  private deviceId = '';
  private appName = 'Biswap';
  private appId = environment.dappId;
  private walletClient: WalletConnConnectClient | null = null;
  private isLoggingIn = false;

  getDeviceId(): string {
    return this.deviceId;
  }

  hasDeviceId(): boolean {
    return !!this.deviceId;
  }

  setExternalAddress(address: string) {
    const normalized = this.normalizeAddress(address);
    this.currentAddress.next(normalized);
    if (normalized) {
      this.connectionState.next('open');
    }
  }

  constructor(
    private logger: LoggerService,
    private userState: UserStateService,
    private storage: StorageService,
    private utils: UtilsService,
  ) { }

  /** Call once after you know/persist a deviceId (e.g. post QR pair). */
  initWalletChannel(deviceId: string, appName = 'Biswap', appId?: string, walletAddress?: string): boolean {
    if (!deviceId) {
      this.logger.error('Device ID is required to initialize wallet channel');
      return false;
    }

    if (this.deviceId && this.deviceId !== deviceId) {
      this.logger.warn('Changing device ID from', this.deviceId, 'to', deviceId);
    }

    this.deviceId = deviceId;
    this.appName = appName;
    this.appId = appId || environment.dappId;
    this.logger.info('Initializing wallet channel for device:', deviceId);

    try {
      if (walletAddress) {
        this.logger.info('Using provided wallet address from launch params:', walletAddress);
        this.setExternalAddress(walletAddress);
      }

      const roomId = this.buildRoomId(deviceId);
      if (this.walletClient && this.deviceId !== deviceId) {
        this.walletClient.close();
        this.walletClient = null;
      }

      if (!this.walletClient) {
        this.walletClient = createClient(deviceId, {
          appId: this.appId,
          role: 'dapp',
          scopes: environment.walletConnScopes || ['sendTransaction', 'login'],
          urlBase: environment.walletConnWsRoot || environment.paycoolWebsocketRoot,
          roomId,
          walletAddress, // For direct connection mode
          heartbeatMs: environment.wsHeartbeatMs,
          idleTimeoutMs: environment.wsIdleTimeoutMs,
          keepAlive: true,
          enableLogging: environment.enableLogging,
        });

        this.walletClient.messages$.subscribe({
          next: (msg: any) => this.routeInbound(msg),
          error: (e) => {
            this.logger.error('walletconnconnect stream error', e);
            this.connectionState.next('closed');
          },
        });

        this.walletClient.connectionState$.subscribe(state => {
          this.logger.debug('Connection state changed:', state);
          this.connectionState.next(state);
        });
      } else {
        const state = this.walletClient.getState();
        if (state === 'connecting' || state === 'reconnecting') {
          this.logger.debug('[ConnectService] Wallet client already connecting, skipping connect()');
        } else if (!this.walletClient.isConnected()) {
          this.logger.info('[ConnectService] Connecting existing wallet client...');
          this.walletClient.connect();
        } else {
          this.logger.debug('[ConnectService] Wallet client already connected, skipping connect()');
        }
      }

      // Ask wallet for current address when not provided via launch params
      if (!walletAddress && this.currentAddress.value === '') {
        if (!environment.production) {
          this.logger.info('[ConnectService] Using DEV address:', walletAddress);
        } else {
          // Attempt to get address from wallet
          this.walletClient.getWalletAddress(this.appName).catch(err => {
            this.logger.warn('[ConnectService] Failed to get wallet address initially', err);
          });
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Failed to initialize wallet channel', error);
      this.connectionState.next('closed');
      return false;
    }
  }

  checkConnectionStatus(): Promise<ConnectionState> {
    if (!this.walletClient) {
      return Promise.resolve('closed');
    }
    return Promise.resolve(this.walletClient.getState());
  }

  triggerWalletAddress(walletName = '') {
    this.walletClient?.getWalletAddress(walletName).catch(() => { });
  }

  send(payload: any): void {
    this.walletClient?.send(payload);
  }

  /** Backwards-compatible raw batch sender (approve→createOrder) */
  async sendTransaction(txs: Tx[]): Promise<string[]> {
    if (!this.deviceId) {
      this.logger.error('Cannot send transaction: wallet not connected');
      throw new Error('Wallet not connected');
    }

    if (!txs || txs.length === 0) {
      this.logger.warn('sendTransaction called with empty transaction list');
      return [];
    }

    this.logger.info('Sending', txs.length, 'transaction(s)');

    try {
      const payload = {
        type: 'send-tx-request',
        source: this.appName.replace(/-/g, ' '),
        requestType: 'sendRawTransaction',
        chain: "KANBAN",
        data: txs
      };
      const res = await this.sendWalletRequest(payload, 90000);
      const list = Array.isArray(res?.txids) ? res.txids : (res?.txid ? [res.txid] : []);

      if (list.length) {
        this.logger.info('Transaction successful, txids:', list);
        this.currentTxid.next(list[list.length - 1]);
      } else {
        this.logger.warn('Transaction completed but no txids returned');
      }

      return list;
    } catch (error) {
      this.logger.error('Transaction failed', error);
      throw error;
    }
  }

  /** Higher-level helper used by Buy/Sell */
  async placeOrderKanban(
    isBuy: boolean,
    pairAddr: string,
    baseCoinId: string,
    targetCoinId: string,
    qtyHuman: string,
    priceHuman: string,
    targetCoinDecimals: number,
    // qtyDecimals: number,
    orderHash: string,
  ): Promise<string[]> {

    const qtyString = new BigNumber(qtyHuman).shiftedBy(targetCoinDecimals).integerValue(BigNumber.ROUND_DOWN).toFixed();
    const priceString = new BigNumber(priceHuman).shiftedBy(18).integerValue(BigNumber.ROUND_HALF_EVEN).toFixed();
    //const priceString = new BigNumber(priceHuman).shiftedBy(baseCoinDecimals).integerValue(BigNumber.ROUND_HALF_EVEN).toFixed();

    const approveToken = baseCoinId;
    const needAmount = isBuy ? new BigNumber(priceHuman).multipliedBy(qtyHuman).shiftedBy(targetCoinDecimals).toFixed() : qtyString;

    const approveFunc = {
      "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }],
      "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function"
    } as const;

    const createOrderFunc = {
      "inputs": [
        { "name": "_bid", "type": "bool" },
        { "name": "_baseCoin", "type": "address" },
        { "name": "_targetCoin", "type": "address" },
        { "name": "_amount", "type": "uint256" },
        { "name": "_price", "type": "uint256" },
        { "name": "_orderHash", "type": "bytes32" }
      ],
      "name": "createOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    } as const;

    const approveData = Web3Abi.encodeFunctionCall(approveFunc as any, [pairAddr, needAmount]);
    const createData = Web3Abi.encodeFunctionCall(createOrderFunc as any, [isBuy, baseCoinId, targetCoinId, qtyString, priceString, orderHash]);

    return await this.sendTransaction([
      { to: approveToken, data: approveData },
      { to: pairAddr, data: createData }
    ]);
  }

  /** Wallet → app messages */
  private routeInbound(msg: any) {
    this.logger.debug('[ConnectService] Inbound message:', JSON.stringify(msg));
    try {
      const parsed = typeof msg === 'string' ? JSON.parse(msg) : msg;
      if (!parsed) return;

      if (parsed.type === 'status-update') {
        // If we see any status update, it implies the wallet is active.
        // If we don't have an address yet, ask for it again.
        if (!this.currentAddress.value) {
          this.logger.info('[ConnectService] status-update received but no address yet, triggering fetch...');
          this.triggerWalletAddress(this.appName);
        }

        const statusAddress = this.extractAddress(parsed);
        if (statusAddress) {
          this.logger.info('[ConnectService] Received wallet address via status:', statusAddress);
          this.handleAddressReceived(statusAddress);
          this.connectionState.next('open');
          return;
        }
        const txids = this.extractTxids(parsed);
        if (txids.length) {
          this.logger.info('[ConnectService] Received transaction response (status-update):', txids);
          this.currentTxid.next(txids[txids.length - 1]);
        }
        return;
      }

      if (parsed.type === 'send-tx-response') {
        const txids = this.extractTxids(parsed);
        if (txids.length) {
          this.logger.info('[ConnectService] Received transaction response:', txids);
          this.currentTxid.next(txids[txids.length - 1]);
        }
        return;
      }

      if (parsed.type === 'connect-response') {
        const address = this.extractAddress(parsed);
        if (address) {
          this.logger.info('[ConnectService] Received connect-response, address:', address);
          // Set dummy user state to prevent login loop
          this.userState.setUser({ walletAddress: address, token: 'connected-no-auth' });

          this.handleAddressReceived(address);
          this.connectionState.next('open');
          this.isLoggingIn = false; // Reset flag
        } else {
          this.logger.warn('[ConnectService] Received connect-response without address');
        }
        return;
      }

      if (parsed.type === 'login-response') {
        this.logger.info('[ConnectService] Received login-response:', parsed);
      }

      const address = this.extractAddress(parsed);
      if (address) {
        this.logger.info('[ConnectService] Received wallet address from wallet message:', address);
        this.handleAddressReceived(address);
        this.connectionState.next('open');
        return;
      }

      if (parsed.type === 'login-token') {
        this.logger.info('[ConnectService] Received login token:', parsed.data);
        this.handleLoginToken(parsed.data);
        return;
      }

      if (parsed.source?.split('-')[0] === 'result') {
        this.logger.debug('[ConnectService] Received transaction result:', parsed);
        this.currentTxid.next(parsed);
      }
    } catch (error) {
      this.logger.error('[ConnectService] Error routing inbound message', error, msg);
    }
  }

  private extractTxids(payload: any): string[] {
    if (!payload) return [];
    if (Array.isArray(payload.txids)) return payload.txids;
    if (payload.txid) return [payload.txid];
    return [];
  }

  private extractAddress(payload: any): string {
    if (!payload) return '';
    if (typeof payload.address === 'string') return payload.address;
    if (typeof payload.walletAddress === 'string') return payload.walletAddress;
    if (payload.data && Array.isArray(payload.data)) {
      for (const item of payload.data) {
        if (item && item.chain === 'KANBAN' && item.address) {
          return item.address;
        }
      }
    }
    if (payload.data?.address) return payload.data.address;
    return '';
  }

  reConnectWallet(): boolean {
    if (!this.deviceId) {
      this.logger.warn('Cannot reconnect: no device ID available');
      return false;
    }
    if (!this.walletClient) {
      this.logger.warn('Cannot reconnect: wallet client not initialized');
      return false;
    }

    if (this.walletClient?.isConnected()) {
      this.logger.debug('Wallet already connected');
      return true;
    }

    // Use forceReconnect for more reliable reconnection
    this.logger.info('Forcing wallet reconnection...');
    try {
      this.walletClient?.forceReconnect();
      return true;
    } catch (error) {
      this.logger.error('Failed to force reconnect', error);
      // Fallback to full reinitialization
      return this.initWalletChannel(this.deviceId, this.appName, this.appId);
    }
  }

  walletConnected(): boolean {
    return this.walletClient?.isConnected() ?? false;
  }

  getWalletConnHealth(): WalletConnHealthSnapshot | null {
    return this.walletClient?.getHealthSnapshot() ?? null;
  }

  private buildRoomId(deviceId: string): string {
    return `${deviceId}-${this.appId}`;
  }

  private sendWalletRequest(payload: any, timeoutMs: number): Promise<any> {
    if (!this.walletClient) {
      return Promise.reject(new Error('Wallet not connected'));
    }
    return this.walletClient.sendRequest(payload, timeoutMs);
  }

  private normalizeAddress(address: string): string {
    if (!address) return '';
    const trimmed = address.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
      return trimmed;
    }
    const converted = this.utils.fabToExgAddress(trimmed);
    return converted || trimmed;
  }

  // Identity and Login Flow

  private handleAddressReceived(address: string) {
    const normalized = this.normalizeAddress(address);
    if (!normalized) return;

    if (this.currentAddress.value !== normalized) {
      this.currentAddress.next(normalized);
    }
    const existingUser = this.userState.getUser();
    if (existingUser && existingUser.walletAddress !== normalized) {
      this.userState.setUser({ ...existingUser, walletAddress: normalized });
    }

    this.checkCacheAndLogin(normalized);
  }

  private async checkCacheAndLogin(address: string) {
    if (this.isLoggingIn) return;
    // NOTE: We cannot easily access StorageService which uses IndexedDB/AsyncStorage synchronously or easily here without injection.
    // But we can use localStorage for the token if it was stored there, or assume the App passes it.
    // Better approach: Require StorageService dependency.

    // For this implementation, we will perform the check against what we have in memory or localStorage.
    // Accessing localStorage directly for 'userProfile' as a simplification, assuming StorageService syncs there or we use it directly.
    // Only do this if we want to bypass the async StorageService for this critical path, OR inject StorageService.
    // As StorageService is already imported in `App.ts`, let's assume we can use it if we inject it.
    // But adding it to constructor changes signature.

    // Let's assume we trigger login ONLY if we don't have a valid session in memory.
    const currentUser = this.userState.getUser();
    if (currentUser && currentUser.walletAddress === address) {
      this.logger.info('User already logged in from cache');
      return;
    }

    // No user or mismatch -> Attempt to login
    this.logger.info('No valid session for address, initiating login...');
    this.login(address);
  }

  login(address: string) {
    if (this.isLoggingIn) return;
    this.isLoggingIn = true;

    // Generate requestId for server validation
    const requestId = Math.random().toString(36).slice(2) + Date.now().toString(36);

    const payload = {
      type: 'login-challenge',
      source: `${this.appName}-login`,
      requestId, // Required by server
      data: {
        action: 'connect', // Changed from 'login' to 'connect'
        message: `Connect to ${this.appName}`,
        address: address, // Tell wallet which address we expect
        app: this.appName,
        chain: 'KANBAN'
      }
    };
    // We use send() instead of sendWalletRequest because we don't expect a direct response to this requestId.
    // The flow is: login-challenge -> wallet confirms -> connect-response
    if (this.walletClient) {
      this.walletClient.send(payload);
    } else {
      this.logger.error('Cannot send connect challenge: wallet client not initialized');
      this.isLoggingIn = false;
    }
  }

  private handleLoginToken(userProfile: any) {
    this.isLoggingIn = false;
    if (!userProfile || !userProfile.token) {
      this.logger.error('Invalid user profile received');
      return;
    }
    this.userState.setUser(userProfile);

    // Explicitly update currentAddress if present, ensuring listeners (like WalletPairing) react
    if (userProfile.walletAddress) {
      this.handleAddressReceived(userProfile.walletAddress);
    } else {
      // Fallback: try to extract from 'address' field if legacy
      if (userProfile.address) {
        this.handleAddressReceived(userProfile.address);
      }
    }

    // Persist to storage (handled by App.ts subscription usually, or we do it here if we had StorageService).
    // Emitting to currentUser allows App.ts to react and save it.
  }

  disconnect() {
    this.logger.info('[ConnectService] Disconnecting wallet...');

    // 1. Close WebSocket
    if (this.walletClient) {
      this.walletClient.close();
      this.walletClient = null;
    }

    // 2. Reset Observables
    this.connectionState.next('idle'); // or 'closed'
    this.currentAddress.next('');
    this.currentTxid.next('');
    this.isLoggingIn = false;

    // 3. Clear User State
    this.userState.clearUser();

    // 4. Clear Storage
    this.storage.remove('walletAddress');
    this.storage.remove('userProfile');
    // Optional: Only clear deviceId if you want to force re-pairing from scratch, 
    // but usually deviceId is kept for re-use. User request implied "address should be cleared".
    // clearing "walletAddress" and "userProfile" should be enough.
  }

}
