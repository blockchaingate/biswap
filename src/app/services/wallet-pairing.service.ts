import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { ConnectService } from './connect.service';
import { environment } from '../../environments/environment';

type PairingState = {
  visible: boolean;
  qrUrl: string;
  link: string;
};

@Injectable({
  providedIn: 'root'
})
export class WalletPairingService {
  private readonly state$ = new BehaviorSubject<PairingState>({
    visible: false,
    qrUrl: '',
    link: ''
  });

  constructor(
    private storage: StorageService,
    private connectService: ConnectService
  ) {
    this.connectService.currentAddress.subscribe((addr) => {
      if (addr) {
        this.close();
      }
    });
  }

  get stateChanges() {
    return this.state$.asObservable();
  }

  get state() {
    return this.state$.value;
  }

  ensureConnection(appName: string): string {
    const appId = this.getAppId();
    let deviceId = this.connectService.getDeviceId();
    const queryDeviceId = this.getDeviceIdFromQuery();

    if (queryDeviceId) {
      deviceId = queryDeviceId;
      this.storage.set('deviceId', deviceId);
    }

    if (!deviceId) {
      deviceId = this.storage.get<string>('deviceId') || '';
    }

    if (!deviceId) {
      deviceId = this.generateDeviceId();
      this.storage.set('deviceId', deviceId);
    }

    this.connectService.initWalletChannel(deviceId, appName, appId);
    return deviceId;
  }

  open(appName: string): string {
    const deviceId = this.ensureConnection(appName);
    if (this.connectService.currentAddress.value) {
      return deviceId;
    }

    const link = this.buildPairingUrl(deviceId);
    const socketUrl = this.buildSocketUrl(deviceId);
    const qrUrl = this.buildQrUrl(socketUrl || link);
    this.state$.next({ visible: true, qrUrl, link });
    return deviceId;
  }

  close() {
    this.state$.next({ visible: false, qrUrl: '', link: '' });
  }

  copyLink() {
    const link = this.state$.value.link;
    if (!link) return;
    navigator.clipboard?.writeText(link).catch(() => { });
  }

  private buildPairingUrl(deviceId: string): string {
    const base = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams(window.location.search);
    params.set('appId', this.getAppId());
    params.set('device_id', deviceId);
    const wsRoot = (environment.walletConnWsRoot || environment.paycoolWebsocketRoot || '').trim();
    if (wsRoot && !params.get('ws')) {
      params.set('ws', wsRoot);
    }
    if (!params.get('locale')) {
      const lang = localStorage.getItem('lang');
      if (lang) {
        params.set('locale', lang);
      }
    }
    return `${base}?${params.toString()}`;
  }

  private buildSocketUrl(deviceId: string): string {
    const wsRoot = (environment.walletConnWsRoot || environment.paycoolWebsocketRoot || '').trim();
    if (!wsRoot) return '';

    const appId = this.getAppId();
    const roomId = `${deviceId}-${appId}`;
    const scopes = (environment.walletConnScopes || ['sendTransaction', 'login']).join(',');
    const params = new URLSearchParams({
      appId,
      device_id: deviceId,
      role: 'wallet',
      scopes
    });

    let base = wsRoot.endsWith('/') ? wsRoot.slice(0, -1) : wsRoot;
    if (base.includes('/walletconn@')) {
      const atIndex = base.lastIndexOf('@');
      base = atIndex >= 0 ? base.slice(0, atIndex + 1) : base;
      return `${base}${encodeURIComponent(roomId)}?${params.toString()}`;
    }
    return `${base}/walletconn@${encodeURIComponent(roomId)}?${params.toString()}`;
  }

  private buildQrUrl(value: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(value)}`;
  }

  private getDeviceIdFromQuery(): string {
    const params = new URLSearchParams(window.location.search);
    return params.get('device_id') || params.get('deviceId') || '';
  }

  private getAppId(): string {
    const params = new URLSearchParams(window.location.search);
    return params.get('appId') || params.get('app_id') || this.storage.get<string>('appId') || environment.dappId;
  }

  private generateDeviceId(): string {
    const rand = Math.random().toString(36).slice(2, 10);
    const rand2 = Math.random().toString(36).slice(2, 10);
    return `${Date.now().toString(36)}${rand}${rand2}`.slice(0, 24);
  }
}
