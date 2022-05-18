import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { KanbanMiddlewareService } from 'src/app/services/kanban.middleware.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss'],
})
export class PoolComponent implements OnInit {
  isWalletConnect: boolean = false;
  addLiquidityActive: boolean = false;
  walletSession: any;

  usersProportionOfLiquidityToWhole: number;

  panelOpenState = false;

  firstTokeninPair: number;
  secondTokeninPair: number;
  totalPoolToken: number;
  totalSupply: number;
  yourPoolShare: number;

  constructor(
    private kanbanMiddlewareService: KanbanMiddlewareService,
    private utilService: UtilsService,
    private walletService: WalletService,
    private storageService: StorageService,
    private router: Router,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    this.walletSession = this.storageService.getWalletSession();
    if (this.walletSession != null) {
      this.dataService.sendWalletLabel('Disconnect Wallet');
      this.dataService.setIsWalletConnect(true);
      await this.getExistLiquidity();
    } else {
      this.dataService.sendWalletLabel('Connect Wallet');
      this.dataService.setIsWalletConnect(false);
    }

    this.dataService.GetIsWalletConnect.subscribe((data) => {
      this.isWalletConnect = data;
    });
  }

  addLiquidityFunction() {
    this.router.navigate(['/pool/add']);
  }

 async connectWallet() {
   //TODO after wallet connect need to call getExistLiquidity() methid 
     await this.walletService.connectWallet();
  }

  async getExistLiquidity() {
    //TODO 
    // wallet connection needed here to calculate all numbers
    // and 
    // need to have user pair address, this will come from Muchtar 
    var totalToken =
      await this.kanbanMiddlewareService.getliquidityBalanceOfuser(
        '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc'
      );
    var totalSupply = await this.kanbanMiddlewareService.getTotalSupply(
      '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc'
    );

    if (totalToken != null)
      this.totalPoolToken = this.utilService.toFixedNumber(totalToken);
    this.totalSupply = this.utilService.toFixedNumber(totalSupply);

    this.usersProportionOfLiquidityToWhole =
      this.totalPoolToken / this.totalSupply;
    this.yourPoolShare = (100 * this.totalPoolToken) / this.totalSupply;

    var fisrtToken = await this.kanbanMiddlewareService.balanceOfToken(
      '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc',
      131072
    );
    var secondToken = await this.kanbanMiddlewareService.balanceOfToken(
      '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc',
      131073
    );

    this.firstTokeninPair =
      this.utilService.toFixedNumber(fisrtToken) *
      this.usersProportionOfLiquidityToWhole;
    this.secondTokeninPair =
      this.utilService.toFixedNumber(secondToken) *
      this.usersProportionOfLiquidityToWhole;

    console.log('usersProportionOfLiquidityToWhole');
    console.log(this.usersProportionOfLiquidityToWhole);
  }
}
