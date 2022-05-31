import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.scss']
})
export class StakingComponent implements OnInit {
  walletSession: any;
  totalStaking: number;
  isWalletConnect: boolean = false;


  constructor(
    private router: Router,
    private walletService: WalletService,
    private dataService: DataService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.walletSession = this.storageService.getWalletSession();
    if (this.walletSession != null) {
      this.dataService.sendWalletLabel('Disconnect Wallet');
      this.dataService.setIsWalletConnect(true);
    } else {
      this.dataService.sendWalletLabel('Connect Wallet');
      this.dataService.setIsWalletConnect(false);
    }

    this.dataService.GetIsWalletConnect.subscribe((data) => {
      this.isWalletConnect = data;
      console.log('this.isWalletConnect===', this.isWalletConnect);
    });
  }

  async connectWallet() {
    //TODO after wallet connect need to call getExistLiquidity() methid
    var result = await this.walletService.connectWallet();
    if (result == null) {
      this.connectWallet();
    } else {
      this.ngOnInit();
    }
  }

  addStaking() {
    this.router.navigate(['/staking/add']);
  }
}
