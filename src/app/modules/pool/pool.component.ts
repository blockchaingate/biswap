import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coin } from 'src/app/models/coin';
import { ExistedLiquidity } from 'src/app/models/existLiquidityModel';
import { ResponseExistedLiquidity } from 'src/app/models/resonseModels/response.existedLiquidity';
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

  panelOpenState = false;

  existedLiquidities: ExistedLiquidity[] = [];

  responseList: ResponseExistedLiquidity[];

  fisrtToken: Coin = new Coin();
  secondToken: Coin = new Coin();

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
    this.walletSession = this.storageService.getWalletSession();
    if (this.walletSession != null) {
      this.dataService.sendWalletLabel('Disconnect Wallet');
      this.dataService.setIsWalletConnect(true);
      this.getExistPair();
    } else {
      this.dataService.sendWalletLabel('Connect Wallet');
      this.dataService.setIsWalletConnect(false);
    }
    this.dataService.GetIsWalletConnect.subscribe((data) => {
      this.isWalletConnect = data;
    });
  }

  getExistPair() {
    const addressArray = this.walletSession.state.accounts[0].split(':');
    this.walletAddress = addressArray[addressArray.length - 1];
    console.log(this.walletAddress);

    this.apiService
      .getUserExistPair(this.walletAddress)
      .subscribe((res: any) => {
        this.responseList = res.data.pairs;

        console.log(this.responseList);
        this.responseList.forEach((element, index) => {
          this.getExistLiquidity(element, index);
        });

        // this.getExistLiquidity(res.data);
        // console.log(res)
        // console.log(res.data)
        // console.log(res.data.pairs[0].pairAddress)
        // console.log(res.data.pairs[0].tokens[0].tokenAName)
        // console.log(res.data.pairs[0].tokens[0].tokenACoinType)
        // console.log(res.data.pairs[0].tokens[1].tokenBName)
        // console.log(res.data.pairs[0].tokens[1].tokenBCoinType)
      });
  }

  addLiquidityFunction() {
    this.router.navigate(['/pool/add']);
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

  removeLiquidity() {
    this.router.navigate(['/pool/remove'], {
      state: {
        firstToken: this.fisrtToken,
        secondToken: this.secondToken,
        // yourPoolShare: this.yourPoolShare,
        // firstTokeninPair: this.firstTokeninPair,
        // secondTokeninPair: this.secondTokeninPair,
        // totalPoolToken: this.totalPoolToken,
      },
    });
  }

  // TODO burada olan listeyi html kisminda da liste seklinde gostermek lazim

  async getExistLiquidity(param: ResponseExistedLiquidity, i: number) {
    // if data returns 0 we wont display

    //TODO
    // wallet connection needed here to calculate all numbers
    // and
    // need to have user pair address, this will come from Muchtar

    var totalToken =
      await this.kanbanMiddlewareService.getliquidityBalanceOfuser(
        param.pairAddress
      );
    var totalSupply = await this.kanbanMiddlewareService.getTotalSupply(
      param.pairAddress
    );

    if (totalToken != null) {
      const model: ExistedLiquidity = {
        firstTokenName:"",
        firstTokenType: 0,
        secondTokenName: "",
        secondTokenType: 0,
        pooledFirstToken: 0,
        pooledSecondToken: 0,
        totalPoolToken: 0,
        yourPoolShare: 0,
      };

      model.totalPoolToken = this.utilService.toFixedNumber(totalToken);

      totalSupply = this.utilService.toFixedNumber(totalSupply);

      this.usersProportionOfLiquidityToWhole =
        model.totalPoolToken / totalSupply;
      model.yourPoolShare = (100 * model.totalPoolToken) / totalSupply;

      (model.firstTokenName = param.tokens[0].tokenAName),
        (model.firstTokenType = param.tokens[0].tokenACoinType),
        (model.secondTokenName = param.tokens[1].tokenBName),
        (model.secondTokenType = param.tokens[1].tokenBCoinType),
        (this.fisrtToken.decimal =
          await this.kanbanMiddlewareService.balanceOfToken(
            param.pairAddress,
            model.firstTokenType
          ));
      this.secondToken.decimal =
        await this.kanbanMiddlewareService.balanceOfToken(
          param.pairAddress,
          model.secondTokenType
        );

      model.pooledFirstToken =
        this.utilService.toFixedNumber(this.fisrtToken.decimal) *
        this.usersProportionOfLiquidityToWhole;
      model.pooledSecondToken =
        this.utilService.toFixedNumber(this.secondToken.decimal) *
        this.usersProportionOfLiquidityToWhole;

      this.existedLiquidities.push(model);

      console.log('model =>>>>>>>');
      console.log(model);
    }
  }
}
