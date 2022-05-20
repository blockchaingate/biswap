import { Component, OnInit } from '@angular/core';
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
  walletSession: any;
  walletLabel: string;

  constructor(
    public dataService: DataService,
    public walletService: WalletService,
    public storageService: StorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
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
  }

  async connectWallet() {
   var result = await this.walletService.connectWallet();
   if(!result){
     this.connectWallet();
   }
  }
}
