import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WalletPairingService } from 'src/app/services/wallet-pairing.service';
import { WalletService } from 'src/app/services/wallet.service';
import { ConnectService } from 'src/app/services/connect.service';
import { Language } from '../../../models/language';
import { StorageMap } from '@ngx-pwa/local-storage';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, MatButtonModule, RouterLink, TranslateModule],
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
    { value: 'tc', viewValue: '繁體中文' }
  ];

  selectedLan: Language = { value: 'en', viewValue: 'English' };

  constructor(
    public dataService: DataService,
    public walletService: WalletService,
    private pairingService: WalletPairingService,
    public storageService: StorageService,
    public dialog: MatDialog,
    private _storateMap: StorageMap,
    private tranServ: TranslateService,
    private connectService: ConnectService,
  ) { }

  ngOnInit(): void {
    this.setLan();
    this.walletService.accountSubject.subscribe((account: string) => {
      this.address = account || '';
    });
  }

  showAccount() {
    if (!this.address) {
      return '';
    }
    if (this.address.length <= 10) {
      return this.address;
    }
    return `${this.address.substring(0, 6)}...${this.address.substring(this.address.length - 4)}`;
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
      }
    } else {
      let userLang = navigator.language.substring(0, 2).toLowerCase();
      if (userLang === 'cn' || userLang === 'zh' || userLang === 'sc') {
        this.selectedLan = this.LANGUAGES[1];
        localStorage.setItem('_lan', 'sc');
        this._storateMap.set('_lan', 'sc');
      } else {
        this.selectedLan = this.LANGUAGES[0];
      }
    }
    this.tranServ.use(this.selectedLan.value);
  }

  openClose(lan: Language) {
    this.selectedLan = lan;
    this.tranServ.use(lan.value);
    localStorage.setItem('_lan', lan.value);
    this._storateMap.set('_lan', lan.value);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }


  connectWallet() {
    this.pairingService.open('biswap');
  }

  disConnectWallet() {
    this.connectService.disconnect();
    this.walletService.disconnect();
  }
}
