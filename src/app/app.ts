import { Component, signal, OnInit, OnDestroy, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavListComponent } from './components/shared/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { KanbanService } from './services/kanban.service';
import { ConnectService } from './services/connect.service';
import { LoggerService } from './services/logger.service';
import { StorageService } from './services/storage.service';
import { WalletPairingService } from './services/wallet-pairing.service';
import { WalletService } from './services/wallet.service';
import { Language } from './models/language';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, SidenavListComponent, HeaderComponent, FooterComponent, TranslateModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('biswap');
  walletAddress: string = '';
  appId: string = ''
  appName: string = 'biswap';
  pairingVisible = false;
  pairingQrUrl = '';
  pairingLink = '';
  private pairingAutoPrompted = false;
  private hasReceivedAddress = false;

  urllang: string = '';
  device_id: string = '';
  wallet: any;
  LANGUAGES: Language[] = [
    { value: 'en', viewValue: 'English' },
    { value: 'sc', viewValue: '简体中文' },
    { value: 'tc', viewValue: '繁體中文' }
  ];
  selectedLan: Language = { value: 'en', viewValue: 'English' };
  private readonly PAYCOOL_EVENT_NAME = 'Paycool-Data';
  private subscriptions = new Subscription();

  constructor(
    private kanbanService: KanbanService,
    private storage: StorageService,
    private walletService: WalletService,
    private connectServ: ConnectService,
    private pairingService: WalletPairingService,
    private translate: TranslateService,
    private logger: LoggerService,
    private zone: NgZone,
  ) {
    // this.initializeUrlParams();
  }

  ngOnInit() {
    this.initializeUrlParams();
    this.setupPaycoolEventListener();
    this.kanbanService.getTokenList();
    this.storage.removeWalletSession();
    this.subscriptions.add(this.pairingService.stateChanges.subscribe((state) => {
      this.pairingVisible = state.visible;
      this.pairingQrUrl = state.qrUrl;
      this.pairingLink = state.link;
    }));
    const storedWalletAddress = this.storage.get<string>('walletAddress');
    if (storedWalletAddress) {
      this.walletAddress = storedWalletAddress;
      this.hasReceivedAddress = true;
    }
    this.subscriptions.add(this.connectServ.currentAddress.subscribe((address) => {
      this.zone.run(() => {
        this.walletAddress = address || '';
        if (address) {
          this.hasReceivedAddress = true;
          this.storage.set('walletAddress', address);
          this.pairingService.close();
        } else {
          this.storage.remove('walletAddress');
          if (this.hasReceivedAddress) {
            this.connectWallet();
          }
        }
      });
    }));
    this.autoPromptPairing();
    //this.connectToPaycool();
  }

  /*
  private initializeUrlParams__(): void {
    const urllang = window.location.pathname.split('/')[1];
    this.urllang = urllang || 'en';

    const queryString = window.location.href.split('?')[1];
    if (queryString) {
      const params = new URLSearchParams(queryString);
      this.device_id = params.get('deviceId') ? decodeURIComponent(params.get('deviceId')!) : '';
      this.urllang = params.get('locale') ? decodeURIComponent(params.get('locale')!) : this.urllang;

      switch (this.urllang) {
        case 'en':
          this.selectedLan = this.LANGUAGES[0];
          break;
        case 'zh':
        case 'sc':
          this.selectedLan = this.LANGUAGES[1];
          break;
        case 'tc':
          this.selectedLan = this.LANGUAGES[2];
          break;
      }
      this.translate.use(this.selectedLan.value);
      this.storage.setLanguage(this.selectedLan.value);
    }
  }
*/
   private initializeUrlParams(): void {
    let urllang = window.location.pathname.split('/')[1];
    const params = new URLSearchParams(window.location.search);
    const rawDeviceId = params.get('deviceId') || params.get('device_id');
    const rawWalletAddress = params.get('walletAddress') || params.get('wallet_address');
    const rawAppId = params.get('appId') || params.get('app_id');
    const deviceId = rawDeviceId ? decodeURIComponent(rawDeviceId) : '';
    const urlWalletAddress = rawWalletAddress ? decodeURIComponent(rawWalletAddress) : '';
    const urlAppId = rawAppId ? decodeURIComponent(rawAppId) : '';
    const appId = urlAppId || environment.dappId;
    this.device_id = deviceId;
    this.walletAddress = urlWalletAddress;
    this.appId = appId;

    if (this.device_id) {
      this.logger.info('Initializing wallet channel with device ID:', this.device_id);
      // Store device ID for future sessions
      this.storage.set('deviceId', this.device_id);
      this.storage.setDeviceID(this.device_id);
      if (urlWalletAddress) {
        this.storage.set('walletAddress', urlWalletAddress);
      }
      if (urlAppId) {
        this.storage.set('appId', urlAppId);
      }
      const success = this.connectServ.initWalletChannel(
        this.device_id,
        this.appName,
        this.appId || undefined,
        urlWalletAddress || undefined
      );
      if (!success) {
        this.logger.error('Failed to initialize wallet channel');
      }
    } else {
      // Try to load from storage (device id only; wallet address comes from wallet)
      const storedDeviceId = this.storage.get<string>('deviceId');
      if (storedDeviceId) {
        this.logger.info('Using stored device ID:', storedDeviceId);
        this.device_id = storedDeviceId;
        this.storage.setDeviceID(storedDeviceId);
        this.connectServ.initWalletChannel(
          storedDeviceId,
          this.appName,
          this.appId || undefined,
          undefined
        );
      } else {
        this.logger.warn('No device ID provided and none stored');
      }
    }

    urllang = params.get('locale') ? decodeURIComponent(params.get('locale')!) : urllang;

    this.checkLanguage(urllang);
  }

  private autoPromptPairing(): void {
    const params = new URLSearchParams(window.location.search);
    const hasDeviceParam = !!(params.get('device_id') || params.get('deviceId'));
    const hasWalletParam = !!(params.get('walletAddress') || params.get('wallet_address'));
    if (hasWalletParam) {
      return;
    }
    if (!hasDeviceParam && !this.hasConnectedWallet()) {
      setTimeout(() => {
        if (!this.hasConnectedWallet()) {
          this.pairingService.open(this.appName);
        }
      }, 300);
    }
  }

  private hasConnectedWallet(): boolean {
    return !!this.connectServ.currentAddress.value || !!this.walletAddress;
  }

  connectWallet(): void {
    this.pairingService.open(this.appName);
  }

  disconnectWallet(): void {
    this.hasReceivedAddress = false;
    this.connectServ.disconnect();
    this.walletAddress = '';
    this.storage.remove('walletAddress');
    this.pairingService.close();
    this.connectWallet();
  }

  closePairing(): void {
    this.pairingService.close();
  }

  copyPairingLink(): void {
    this.pairingService.copyLink();
  }

  confirmPairing(): void {
    this.pairingService.close();
    this.connectServ.reConnectWallet();
    this.connectServ.triggerWalletAddress(this.appName);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setupPaycoolEventListener(): void {
    document.removeEventListener(this.PAYCOOL_EVENT_NAME, this.handlePaycoolData);
    document.addEventListener(this.PAYCOOL_EVENT_NAME, this.handlePaycoolData.bind(this));
  }

  private handlePaycoolData(event: Event): void {
    const customEvent = event as CustomEvent;
    const data = customEvent.detail?.data;
    if (data && Array.isArray(data.data)) {
      this.processPaycoolData(data.data);
    } else {
      console.error('Invalid data received:', data);
    }
  }

  private processPaycoolData(data: any[]): void {
    for (const wallet of data) {
      if (wallet.chain === 'KANBAN') {
        this.walletService.connectWalletSocket(wallet);
        break;
      }
    }
  }

    checkLanguage(lang: string): void {
    if (lang && lang.length === 2) {
      lang = lang.toLowerCase();
      const theLang = this.LANGUAGES.find(language => language.value === lang);
      if (theLang) {
        this.selectedLan = theLang;
        this.selectedLan = this.LANGUAGES.filter(language => language.value === lang)[0] || this.LANGUAGES[0];
        this.logger.debug('Language set to:', lang);
      } else {
        // the url language is not supported
        this.selectedLan = this.LANGUAGES[0];
        this.selectedLan = this.LANGUAGES[0];
        this.logger.warn('Unsupported language:', lang, 'using English');
      }
    } else {
      this.selectedLan = this.LANGUAGES[0];
    }

    // Store language preference
    this.storage.set('language', this.selectedLan.value);
  }

  setLanguage(): void {
    this.translate.use(this.selectedLan.value);
    this.translate.setDefaultLang(this.selectedLan.value);
  }

  switchLanguage(lang: string): void {
    this.selectedLan = this.LANGUAGES.find(language => language.value === lang) || this.LANGUAGES[0];
    this.translate.use(lang);
    this.storage.set('language', lang);
    this.logger.info('Language switched to:', lang);
  }

/*
  private connectToPaycool(): void {
    var account = '';
    if (this.device_id) {
      this.walletService.accountSubject.subscribe((param: string) => {
        account = param;
      });
      const client = createClient(this.device_id, {
           appId: environment.dappId,
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
      client.on('message', (response: string) => {
        try {
          const data = JSON.parse(response);
          // Check if data has a property 'data'
          if (data && data.hasOwnProperty('data') && data.hasOwnProperty('source')) {
            if (account === '') {

              if (data["source"] != null) {
                let str = data["source"];
                let parts = str.split("-");
                let secondPart = parts[1];
                if (secondPart == "connect") {
                  data.data.forEach((item: any) => {
                    if (item.chain === "FAB") {
                      this.walletService.connectWalletSocket(item);
                    }
                  });
                }
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse response or unexpected error:', e);
        }
      });

    }
  }
*/
}
