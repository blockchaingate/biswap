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

  firstTokeninPair: number;
  secondTokeninPair: number;
  totalPoolToken: number;
  totalSupply: number;
  yourPoolShare: number;

  walletAddress: string;

  constructor(
    private apiService: ApiService,
    private kanbanMiddlewareService: KanbanMiddlewareService,
    private utilService: UtilsService,
    private walletService: WalletService,
    private storageService: StorageService,
    private router: Router,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    /*
    this.walletSession = this.storageService.getWalletSession();
    if (this.walletSession != null) {
      this.dataService.sendWalletLabel('Disconnect Wallet');
      this.dataService.setIsWalletConnect(true);
      this.getExistPair();
      await this.getExistLiquidity();
    } else {
      this.dataService.sendWalletLabel('Connect Wallet');
      this.dataService.setIsWalletConnect(false);
    }
    this.dataService.GetIsWalletConnect.subscribe((data) => {
      this.isWalletConnect = data;
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


  getExistPair(){
    const addressArray = this.walletSession
        .state.accounts[0].split(':');
      this.walletAddress = addressArray[addressArray.length - 1];
      console.log(this.walletAddress);

    this.apiService.getUserExistPair(this.walletAddress).subscribe((res: any) =>{
      console.log(res)
      console.log(res.data)
    })
  }

  addLiquidityFunction() {
    this.router.navigate(['/pool/add']);
  }

  async connectWallet() {
    this.walletService.connectWalletNew();
    //TODO after wallet connect need to call getExistLiquidity() methid
    /*
    var result = await this.walletService.connectWallet();
    if (result == null) {
      this.connectWallet();
    } else {
      this.ngOnInit();
    }
    */
  }

  removeLiquidity() {
    this.router.navigate(['/pool/remove'], {
      state: {
        firstToken: this.fisrtToken,
        secondToken: this.secondToken,
        yourPoolShare: this.yourPoolShare,
        firstTokeninPair: this.firstTokeninPair,
        secondTokeninPair: this.secondTokeninPair,
        totalPoolToken: this.totalPoolToken,
      },
    });
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

    //here token will fetch from service Muchtar will set

    this.fisrtToken.tickerName = 'FAB';
    this.secondToken.tickerName = 'EXG';

    this.fisrtToken.coinType = 131072;
    this.secondToken.coinType = 131073;

    this.fisrtToken.decimal = await this.kanbanMiddlewareService.balanceOfToken(
      '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc',
      this.fisrtToken.coinType
    );
    this.secondToken.decimal =
      await this.kanbanMiddlewareService.balanceOfToken(
        '0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc',
        this.secondToken.coinType
      );

    this.firstTokeninPair =
      this.utilService.toFixedNumber(this.fisrtToken.decimal) *
      this.usersProportionOfLiquidityToWhole;
    this.secondTokeninPair =
      this.utilService.toFixedNumber(this.secondToken.decimal) *
      this.usersProportionOfLiquidityToWhole;

    console.log('usersProportionOfLiquidityToWhole');
    console.log(this.usersProportionOfLiquidityToWhole);
  }
}
