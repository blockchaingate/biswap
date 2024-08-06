import { Component } from '@angular/core';
import { KanbanService } from './services/kanban.service';
import { StorageService } from './services/storage.service';
import { WalletService } from './services/wallet.service';
import { createConnection } from 'cool-connect';
import { Language } from './models/language';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'biSwap';
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

  constructor(
    private kanbanService: KanbanService,
    private storageService: StorageService,
    private walletService: WalletService,
    private tranServ: TranslateService,
    private _localSt: LocalStorage,
  ) {
    this.initializeUrlParams();
    this.kanbanService.getTokenList();
    this.storageService.removeWalletSession();
  }

  ngOnInit() {
    this.setupPaycoolEventListener();
    this.connectToPaycool();
    this.storageService.removeWalletSession();
  }

  private initializeUrlParams(): void {
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
      this.tranServ.use(this.selectedLan.value);
      localStorage.setItem('_lan', this.selectedLan.value);
      this._localSt.setItem('_lan', this.selectedLan.value);
    }
  }

  private setupPaycoolEventListener(): void {
    document.removeEventListener(this.PAYCOOL_EVENT_NAME, this.handlePaycoolData);
    document.addEventListener(this.PAYCOOL_EVENT_NAME, this.handlePaycoolData.bind(this));
  }

  private handlePaycoolData(event: Event): void {
    console.log('handlePaycoolData');
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
        console.log('KANBAN address:', wallet.address);
        break;
      }
    }
  }

  private connectToPaycool(): void {
    var account = '';
    if (this.device_id) {
      this.walletService.accountSubject.subscribe((param: string) => {
        account = param;
      });
      createConnection(this.device_id).subscribe((response) => {
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
          } else {
            console.log('Response does not have the expected structure or source is missing');
          }
        } catch (e) {
          console.error('Failed to parse response or unexpected error:', e);
        }
      });
      
    }
  }

}
