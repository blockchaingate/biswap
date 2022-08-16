import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { WalletService } from 'src/app/services/wallet.service';

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

  constructor(
    public dataService: DataService,
    public walletService: WalletService,
    public storageService: StorageService,
    public dialog: MatDialog
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
    this.account = this.walletService.account;
    if(!this.account) {
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
        }
      );
    }
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
