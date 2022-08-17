import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletService } from 'src/app/services/wallet.service';
import { Language } from '../../../models/language';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  languages: Language[] = [
    { value: 'en', viewValue: 'English' },
    { value: 'sc', viewValue: '简体中文' },
    { value: 'tc', viewValue: '繁體中文' }
  ];

  selectedLan = this.languages[0];
  walletSession: any;
  walletLabel: string = '';
  account: string = '';

  constructor(
    public dataService: DataService,
    public walletService: WalletService,
    public storageService: StorageService,
    public dialog: MatDialog,
    private _localSt: LocalStorage,
    private tranServ: TranslateService,
  ) {}

  ngOnInit(): void {
    /*
    this.walletSession = this.storageService.getWalletSession();
    if (this.walletSession != null) {
      this.dataService.sendWalletLabel('Disconnect Wallet');
      this.dataService.setIsWalletConnect(true);
    }
    else{
      this.dataService.sendWalletLabel('Connect Wallet');
      this.dataService.setIsWalletConnect(false);
    }
    this.dataService.GetWaletLabel.subscribe((data) => {
      this.walletLabel = data;
    });
    */
   this.setLan();
    this.account = this.walletService.account;
    if(!this.account) {
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
        }
      );
    }
  }

  setLan() {
    const storedLan = localStorage.getItem('_lan');
    if (storedLan) {
      if (storedLan === 'en') {
        this.selectedLan = this.languages[0];
      } else if (storedLan === 'sc') {
        this.selectedLan = this.languages[1];
      } else if (storedLan === 'tc') {
        this.selectedLan = this.languages[2];
      }
    } else {
      let userLang = navigator.language;
      userLang = userLang.substr(0, 2);
      if (userLang === 'CN' || userLang === 'cn' || userLang === 'zh') {
        this.selectedLan = this.languages[1];
        localStorage.setItem('_lan', 'sc');
        this._localSt.setItem('_lan', 'sc');
      }
    }
    this.tranServ.use(this.selectedLan.value);
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
