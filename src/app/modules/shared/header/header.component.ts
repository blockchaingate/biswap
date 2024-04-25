import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletService } from 'src/app/services/wallet.service';
import { Language } from '../../../models/language';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { SocketService } from 'src/app/services/websocket.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  walletSession: any;
  walletLabel: string = '';
  account: string = '';

  LANGUAGES: Language[] = [
    { value: 'en', viewValue: 'English' },
    { value: 'sc', viewValue: '简体中文' },
    { value: 'tc', viewValue: '繁體中文' }
  ];

  selectedLan: Language = { value: 'en', viewValue: 'English' };

  constructor(
    public dataService: DataService,
    public walletService: WalletService,
    public storageService: StorageService,
    public dialog: MatDialog,
    private _localSt: LocalStorage,
    private utilsServ: UtilsService,
    private tranServ: TranslateService,
    private socketService: SocketService   
  ) {}

  ngOnInit(): void {
    this.account = this.walletService.account;
    if(!this.account) {
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
        }
      );
    }
    this.socketService.connectSocket();
    this.setLan();
  }

  showAccount() {
    const address = this.utilsServ.exgToFabAddress(this.account);
    return address.substring(0,3) + '...' + address.substring(address.length - 3);
  }

  setLan() {
    const storedLan = localStorage.getItem('_lan');
    if (storedLan) {
      if (storedLan === 'en') {
        this.selectedLan = this.LANGUAGES[0];
      } else if (storedLan === 'sc') {
        this.selectedLan = this.LANGUAGES[1];
      } else if (storedLan === 'tc') {
        this.selectedLan = this.LANGUAGES[2];
      }
    } else {
      let userLang = navigator.language;
      userLang = userLang.substring(0, 2);
      if (userLang === 'CN' || userLang === 'cn' || userLang === 'zh') {
        this.selectedLan = this.LANGUAGES[1];
        localStorage.setItem('_lan', 'sc');
        this._localSt.setItem('_lan', 'sc');
      }
    }
    this.tranServ.use(this.selectedLan.value);
  }

  openClose(lan: Language) {
    this.selectedLan = lan;
    this.tranServ.use(lan.value);

    localStorage.setItem('_lan', lan.value);
    this._localSt.setItem('_lan', lan.value);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  connectWallet() {
   //await this.walletService.connectWallet();
   this.walletService.connectWalletNew();
  }

  disConnectWallet() {
    console.log('go for disconnect');
    this.walletService.disconnect();
  }
}
