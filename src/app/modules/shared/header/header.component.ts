import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletService } from 'src/app/services/wallet.service';
import { Language } from '../../../models/language';
import { LocalStorage } from '@ngx-pwa/local-storage';
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
  address: string = '';

  LANGUAGES: Language[] = [
    { value: 'en', viewValue: 'English' },
    { value: 'sc', viewValue: '简体中文' },
    { value: 'tc', viewValue: '繁體中文' },
    { value: 'fr', viewValue: 'Français' },
    { value: 'es', viewValue: 'Español' },
    { value: 'it', viewValue: 'Italiano' },
    { value: 'ja', viewValue: '日本語' },
    { value: 'ko', viewValue: '한국어' },
    { value: 'tr', viewValue: 'Türkçe' },
    { value: 'ar', viewValue: 'العربية' }
  ];

  selectedLan: Language = { value: 'en', viewValue: 'English' };

  constructor(
    public dataService: DataService,
    public walletService: WalletService,
    public storageService: StorageService,
    public dialog: MatDialog,
    private _localSt: LocalStorage,
    private tranServ: TranslateService,
    private utilsServ: UtilsService,
  ) { }

  ngOnInit(): void {
    this.setLan();
    this.walletService.accountSubject.subscribe((account: string) => {
      if(account) {
        console.log('account header ----------------------------------------->', account);
        this.address = this.utilsServ.exgToFabAddress(account);
      }else{
        console.log('account header null----------------------------------------->');
        this.address = '';
      }

    });
  }

  showAccount() {
      return this.address.substring(0, 3) + '...' + this.address.substring(this.address.length - 3);
  }

  setLan() {
    const storedLan = localStorage.getItem('_lan');

    if (storedLan) {
      switch (storedLan) {
        case 'en':
          this.selectedLan = this.LANGUAGES[0];
          break;
        case 'sc':
          this.selectedLan = this.LANGUAGES[1];
          break;
        case 'tc':
          this.selectedLan = this.LANGUAGES[2];
          break;
        case 'fr':
          this.selectedLan = this.LANGUAGES[3];
          break;
        case 'es':
          this.selectedLan = this.LANGUAGES[4];
          break;
        case 'it':
          this.selectedLan = this.LANGUAGES[5];
          break;
        case 'ja':
          this.selectedLan = this.LANGUAGES[6];
          break;
        case 'ko':
          this.selectedLan = this.LANGUAGES[7];
          break;
        case 'tr':
          this.selectedLan = this.LANGUAGES[8];
          break;
        case 'ar':
          this.selectedLan = this.LANGUAGES[9];
          break;
        default:
          this.selectedLan = this.LANGUAGES[0]; // default to English
      }
    } else {
      let userLang = navigator.language.substring(0, 2).toLowerCase();
      if (userLang === 'cn' || userLang === 'zh' || userLang === 'sc') {
        this.selectedLan = this.LANGUAGES[1];
        localStorage.setItem('_lan', 'sc');
        this._localSt.setItem('_lan', 'sc');
      } else {
        this.tranServ.use(this.selectedLan.value);
        localStorage.setItem('_lan', this.selectedLan.value);
        this._localSt.setItem('_lan', this.selectedLan.value);
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
    this.walletService.connectWalletNew();
  }

  disConnectWallet() {
    this.walletService.disconnect();
  }
}
