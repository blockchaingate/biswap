import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  usersProportionOfLiquidityToWhole: number;
  account: string;
  panelOpenState = false;

  fisrtToken: Coin = new Coin();
  secondToken: Coin = new Coin();


  fisrtTokenName: number=0;
  secondTokenName: number=0;

  firstTokeninPair: number;
  secondTokeninPair: number;
  totalPoolToken: number;
  totalSupply: number;
  yourPoolShare: number;

  walletAddress: string;


  existedLiquidityList: any[] = [];

  page: number = 0;
  constructor(
    private apiService: ApiService,
    private walletService: WalletService,
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


  getExistLiquidity(){
    this.apiService.getUserExistPair(this.account, this.page).subscribe((res: any) =>{

      if(res.length > 0){
        this.existedLiquidityList = [...this.existedLiquidityList,...res] ;
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
        totalPoolToken: this.existedLiquidityList[index].liquidityTokenBalance,
      },
    });
  }

  // async getExistLiquiditya() {

  //   //TODO
  //   // wallet connection needed here to calculate all numbers
  //   // and
  //   // need to have user pair address, this will come from Muchtar
  //   var totalToken =
  //     await this.kanbanMiddlewareService.getliquidityBalanceOfuser(
  //       '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc'
  //     );
  //   var totalSupply = await this.kanbanMiddlewareService.getTotalSupply(
  //     '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc'
  //   );

  //   if (totalToken != null)
  //     this.totalPoolToken = this.utilService.toFixedNumber(totalToken);
  //   this.totalSupply = this.utilService.toFixedNumber(totalSupply);

  //   this.usersProportionOfLiquidityToWhole =
  //     this.totalPoolToken / this.totalSupply;
  //   this.yourPoolShare = (100 * this.totalPoolToken) / this.totalSupply;

  //   //here token will fetch from service Muchtar will set

  //   this.fisrtToken.tickerName = 'FAB';
  //   this.secondToken.tickerName = 'EXG';

  //   this.fisrtToken.coinType = 131072;
  //   this.secondToken.coinType = 131073;

  //   this.fisrtToken.decimal = await this.kanbanMiddlewareService.balanceOfToken(
  //     '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc',
  //     this.fisrtToken.coinType
  //   );
  //   this.secondToken.decimal =
  //     await this.kanbanMiddlewareService.balanceOfToken(
  //       '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc',
  //       this.secondToken.coinType
  //     );

  //   this.firstTokeninPair =
  //     this.utilService.toFixedNumber(this.fisrtToken.decimal) *
  //     this.usersProportionOfLiquidityToWhole;
  //   this.secondTokeninPair =
  //     this.utilService.toFixedNumber(this.secondToken.decimal) *
  //     this.usersProportionOfLiquidityToWhole;

  //   console.log('usersProportionOfLiquidityToWhole');
  //   console.log(this.usersProportionOfLiquidityToWhole);
  // }
}
