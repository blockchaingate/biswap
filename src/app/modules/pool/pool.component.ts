import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import { Coin } from 'src/app/models/coin';
import { ApiService } from 'src/app/services/api.services';
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

  usersProportionOfLiquidityToWhole!: number;
  account: string = '';
  panelOpenState = false;

  fisrtToken: Coin = new Coin();
  secondToken: Coin = new Coin();


  fisrtTokenName: number=0;
  secondTokenName: number=0;

  firstTokeninPair!: number;
  secondTokeninPair!: number;
  totalPoolToken!: number;
  totalSupply!: number;
  yourPoolShare!: number;

  walletAddress: string = '';


  existedLiquidityList: any[] = [];

  page: number = 0;
  constructor(
    private apiService: ApiService,
    private walletService: WalletService,
    private utilServ: UtilsService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.account = this.walletService.account;
    if(!this.account) {
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
          this.getExistLiquidity();
        }
      );
    }else {
      this.getExistLiquidity();
    }
  }

  showAmount(amount: any) {
    return new BigNumber(amount).shiftedBy(-18).toNumber()
  }
  
  getExistLiquidity(){
    this.apiService.getUserExistPair(this.account, this.page).subscribe((res: any) =>{
      if(res.length > 0){
        /*
        for (const item of res) {
          item.liquidityTokenBalance = item.liquidityTokenBalance / 1e18;
        }
        */
        this.existedLiquidityList = res ;
        this.page ++;
      }
    })
  }

  addLiquidityFunction() {
    this.router.navigate(['/pool/add']);
  }

  async connectWallet() {
    this.walletService.connectWalletNew();
  }

  removeLiquidity(index: number) {

    this.router.navigate(['/pool/remove'], {
      state: {
        pairId: this.existedLiquidityList[index].pair.id,
        firstToken: parseInt(this.existedLiquidityList[index].pair.token0.id, 16),
        secondToken: parseInt(this.existedLiquidityList[index].pair.token1.id, 16),
        yourPoolShare: this.existedLiquidityList[index].share,
        pooledFirstToken: this.existedLiquidityList[index].pair.reserve0,
        pooledSecondToken: this.existedLiquidityList[index].pair.reserve1,
        totalPoolToken: this.existedLiquidityList[index].liquidityTokenBalance 
      },
    });
  }

}
