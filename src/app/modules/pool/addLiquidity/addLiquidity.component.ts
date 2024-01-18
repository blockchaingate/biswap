import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import { ErrorMessagesComponent } from 'src/app/components/errorMessages/errorMessages.component';
import { Coin } from 'src/app/models/coin';
import { TimestampModel } from 'src/app/models/temistampModel';
import { ApiService } from 'src/app/services/api.services';
import { DataService } from 'src/app/services/data.service';
import { KanbanMiddlewareService } from 'src/app/services/kanban.middleware.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { UtilsService } from 'src/app/services/utils.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';
import { TokenListComponent } from '../../shared/tokenList/tokenList.component';
import { SettingsComponent } from '../../settings/settings.component';
import { BiswapService } from 'src/app/services/biswap.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import {
  MatSnackBar
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-addLiquidity',
  templateUrl: './addLiquidity.component.html',
  styleUrls: ['./addLiquidity.component.scss'],
})
export class AddLiquidityComponent implements OnInit {
  slippage = 1;
  deadline = 20;
  error: string = '';
  _firstToken!: Coin;
  _secondToken!: Coin;
  insufficientFund: boolean = false;
  item: any;

  public get firstToken(): Coin {
    return this._firstToken;
  }
  public set firstToken(coin: Coin) {
    this._firstToken = coin;
    const id = coin.id;
    if(this.account && id) {
      this.kanbanService.getTokenBalance(this.account, id).subscribe(
        (balance: any) => {
          this.firstCoinBalance = balance;
        }
      );
    }
    

  }
 
  public get secondToken(): Coin {
    return this._secondToken;
  }
  public set secondToken(coin: Coin) {
    this._secondToken = coin;
    const id = coin.id;
    if(this.account && id) {
      this.kanbanService.getTokenBalance(this.account, id).subscribe(
        (balance: any) => {
          this.secondCoinBalance = balance;
        }
      );
    }

  }
  tokenList: Coin[] = [];

  isWalletConnect: boolean = true;

  firstCoinAmount!: number;
  secondCoinAmount!: number;
  _account: string ='';

  public get account(): string {
    return this._account;
  }

  public set account(newAccount: string) {
    this._account = newAccount;
    console.log('newAccount=', newAccount);
    if(newAccount) {
      if(this.firstToken && this.firstToken.id) {
        this.kanbanService.getTokenBalance(newAccount, this.firstToken.id).subscribe(
          (balance: any) => {
            this.firstCoinBalance = balance;
          }
        );
      }

      if(this.secondToken && this.secondToken.id) {
        this.kanbanService.getTokenBalance(newAccount, this.secondToken.id).subscribe(
          (balance: any) => {
            this.secondCoinBalance = balance;
          }
        );
      }
    }
    this.checkLiquidity();
  }

  perAmount: string = '';
  perAmountLabel: string = '';

  txHash: String = '';
  newPair: String ='';

  isNewPair: boolean = false;

  firstTokenReserve: BigNumber = new BigNumber(0);
  secondTokenReserve: BigNumber = new BigNumber(0);

  secondCoinBalance!: number;
  firstCoinBalance!: number;

  //walletAddress:string;
  _pairAddress: string = '';

  get pairAddress(): string {
    return this._pairAddress;
  }

  set pairAddress(_pairAddress: string) {
    this._pairAddress = _pairAddress;
    this.checkLiquidity();
  } 

  constructor(
    private kanbanMiddlewareService: KanbanMiddlewareService,
    private utilService: UtilsService,
    private web3Service: Web3Service,
    private dataService: DataService,
    public dialog: MatDialog,
    private biswapServ: BiswapService,
    private kanbanService: KanbanService,
    private walletService: WalletService,
    private currentRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.firstToken = new Coin();
    this.secondToken = new Coin();

    this.secondCoinBalance = -1;
    this.firstCoinBalance = -1;

    this.account = this.walletService.account;
    if(!this.account){
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
        }
      );
    }
    this.dataService.GettokenList.subscribe((x) => {
      this.tokenList = x;
    });
    this.checkUrlToken();
  }

  checkLiquidity() {
    if(!this.account || !this.pairAddress) {
      return;
    }
    this.biswapServ.getLiquidity(this.account, this.pairAddress).subscribe(
      (item: any) => {
        if(item && !item.error) {
          this.item = item;
        }
      }
    );
  }
  openSettings() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '250px',
      data: {slippage: this.slippage, deadline: this.deadline},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.slippage = result.slippage;
        this.deadline = result.deadline;
      }

    });
  }

  checkUrlToken(){
    this.currentRoute.params.subscribe((x) =>{
      var type = this.router.url.split("/")
      if (type[3] == "token") {
        let params: any = x;
        this.apiService.getTokenInfoFromId(params.tokenid).subscribe((res: any) =>{
          if(res) {
            let first = res["name"];
            this.firstToken = this.tokenList.find(x => x.tickerName == first) || new Coin();
          }
        })  
      } else if(x.tokenid){
        let params: any = x;
         this.apiService.getTokensInfoFromPair(params.tokenid).subscribe((res: any) =>{
          if(res) {
            let first = res["token0Name"];
            let sescond = res["token1Name"];
            this.firstToken = this.tokenList.find(x => x.tickerName == first) || new Coin();
            this.secondToken = this.tokenList.find(x => x.tickerName == sescond) || new Coin();
          }
        })
      }
  });
  }

  async onKey(value: number, isFistToken: boolean) {
    if (
      this.firstToken.tickerName != null &&
      this.secondToken.tickerName != null &&
      value != null &&
      value != undefined &&
      !this.isNewPair
    ) {
      await this.setInputValues(isFistToken);
    } else if (value == null && value == undefined && !this.isNewPair) {
      if (isFistToken) {
        this.secondCoinAmount = 0;
      } else {
        this.firstCoinAmount = 0;
      }
    } else if (this.isNewPair) {
      if (!isFistToken) {
        this.secondCoinAmount = value;
      } else {
        this.firstCoinAmount = value;
      }
    }

    /*
    if(!this.firstCoinAmount ||
      !this.secondCoinAmount ||
      !this.firstCoinBalance || 
      !this.secondCoinBalance ||
      (Number(this.firstCoinAmount) > Number(this.firstCoinBalance)) ||
      (Number(this.secondCoinAmount) > Number(this.secondCoinBalance))) {
        this.insufficientFund = true;
      } else {
        this.insufficientFund = false;
      }
    */
  }

  async setInputValues(isFirst: boolean) {
    if (isFirst) {
      var amount: number = this.firstCoinAmount;
      var reserve1: BigNumber = this.firstTokenReserve;
      var reserve2: BigNumber = this.secondTokenReserve;
      let value = new BigNumber(amount)
        .multipliedBy(new BigNumber(1e18))
        .toFixed();
      value = value.split('.')[0];
      const params = [value, reserve1, reserve2];

      this.secondCoinAmount = await this.kanbanMiddlewareService.getQuote(
        params
      );
    } else {
      var amount: number = this.secondCoinAmount;
      var reserve1: BigNumber = this.firstTokenReserve;
      var reserve2: BigNumber = this.secondTokenReserve;
      let value = new BigNumber(amount)
        .multipliedBy(new BigNumber(1e18))
        .toFixed();
      value = value.split('.')[0];
      const params = [value, reserve2, reserve1];

      this.firstCoinAmount = await this.kanbanMiddlewareService.getQuote(
        params
      );
    }
  }

  openDialog(errorMessage: String) {
    this.dialog.open(ErrorMessagesComponent, { data: errorMessage });
  }

  kanbanCallMethod() {
    if(!this.firstToken.id || !this.secondToken.id) {
      return;
    }
    var params = [this.firstToken.id, this.secondToken.id];
    var abiHex = this.web3Service.getPair(params);
    this.kanbanService
      .kanbanCall(environment.smartConractAdressFactory, abiHex)
      .subscribe((data1) => {
          let res: any = data1;
          var addeess = this.web3Service.decodeabiHex(res.data, 'address');
          console.log('address=', addeess);
          if (
            addeess.toString() != '0x0000000000000000000000000000000000000000'
          ) {
            this.pairAddress = addeess.toString();
            var abiHexa = this.web3Service.getReserves();
            this.kanbanService
              .kanbanCall(addeess.toString(), abiHexa)
              .subscribe((data3) => {
                  var param = ['uint112', 'uint112', 'uint32'];
                  let res: any = data3;
                  console.log('res.data');
                  console.log(res.data);
                  var value = this.web3Service.decodeabiHexs(res.data, param);
                  console.log(value);
                  if (this.firstToken.type < this.secondToken.type) {
                    this.firstTokenReserve = value[0];
                    this.secondTokenReserve = value[1];
                  } else {
                    this.firstTokenReserve = value[1];
                    this.secondTokenReserve = value[0];
                  }
                  var perAmount = (value[0] / value[1]).toString();

                  this.perAmountLabel =
                    this.firstToken.tickerName +
                    ' per ' +
                    this.secondToken.tickerName;

                  this.perAmount = perAmount;
              });
            this.isNewPair = false;
            this.newPair = '';
          } else {
            this.newPair = 'You are adding liquidity to new pair';
            this.isNewPair = true;
          }
      })
  }

  openFirstTokenListDialog() {

    this.dialog
      .open(TokenListComponent, {
        data: {
          tokens: this.tokenList,
          isFirst: true,
        },
      })
      .afterClosed()
      .subscribe((x) => {
        console.log('x of afterClosed=', x);
        if (x.isFirst) {
          console.log('go here');
          this.dataService.GetFirstToken.subscribe((data) => {
            console.log('data of GetFirstToken');
            this.firstToken = data;
          });
        }
        console.log('go threre');
        if (this.firstToken.id != null && this.secondToken.id != null) {
          this.kanbanCallMethod();
        }
      });
  }

  connectWallet() {
    this.walletService.connectWalletNew();
  }

  openSecondTokenListDialog() {
    this.dialog
      .open(TokenListComponent, {
        data: {
          tokens: this.tokenList,
          isSecond: true,
        },
      })
      .afterClosed()
      .subscribe((x) => {
        console.log('x of afterClosed=', x);
        if (x.isSecond) {
          this.dataService.GetSecondToken.subscribe((data) => {
            this.secondToken = data;
          });
        }

        if (this.firstToken.id != null && this.secondToken.id != null) {
          this.kanbanCallMethod();
        }
      });
  }

  refresh() {
    this.kanbanService.getTokenBalance(this.account, this.firstToken.id).subscribe(
      (balance: any) => {
        this.firstCoinBalance = balance;
      }
    );

    this.kanbanService.getTokenBalance(this.account, this.secondToken.id).subscribe(
      (balance: any) => {
        this.secondCoinBalance = balance;
      }
    );
    
    this.checkLiquidity();
  }

  addLiqudity() {

    console.log('this.firstToken===', this.firstToken);
    console.log('this.secondToken===', this.secondToken);
    console.log('go for addLiquidity');

    const paramsSent: any = [];
    let amountADesired = '0x' + new BigNumber(this.firstCoinAmount)
      .shiftedBy(this.firstToken.decimals)
      .toString(16).split('.')[0];
    let amountBDesired = '0x' + new BigNumber(this.secondCoinAmount)
      .shiftedBy(this.secondToken.decimals)
      .toString(16).split('.')[0];

    var tokenA = this.firstToken.id;
    var tokenB = this.secondToken.id;

    let params: any = [environment.smartConractAdressRouter, amountADesired];
    let abiHex = this.web3Service.getApprove(params);

    paramsSent.push({
      to: tokenA,
      data: abiHex
    });

    params = [environment.smartConractAdressRouter, amountBDesired];
    abiHex = this.web3Service.getApprove(params);

    paramsSent.push({
      to: tokenB,
      data: abiHex
    });

    //var amountADesireda = '0x' + new BigNumber(amountADesired).toString(16);
    //var amountBDesireda = '0x' + new BigNumber(amountBDesired).toString(16);

    var amountAMin = '0x' + new BigNumber(this.firstCoinAmount)
    .multipliedBy(new BigNumber(1).minus(new BigNumber(this.slippage * 0.01))).shiftedBy(18)
    .toString(16).split('.')[0];
    var amountBMin = '0x' + new BigNumber(this.secondCoinAmount)
    .multipliedBy(new BigNumber(1).minus(new BigNumber(this.slippage * 0.01))).shiftedBy(18)
    .toString(16).split('.')[0];
    var to = this.account;
    var timestamp = new TimestampModel(
      this.deadline,
      0,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

    params = [
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline,
    ];

    abiHex = this.web3Service.addLiquidity(params);
    const alertDialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: {text: 'Please approve your request in your wallet'},
    });
    paramsSent.push({
      to: environment.smartConractAdressRouter,
      data: abiHex
    });
    this.kanbanService
      .sendParams(paramsSent)
      .then((data) => { 
        alertDialogRef.close();
        const baseUrl = environment.production ? 'https://www.exchangily.com' : 'https://test.exchangily.com';
        this.txHash = baseUrl + '/explorer/tx-detail/' + data;

        setTimeout(() => {
          this.refresh()
        }, 6000);

      }).catch(
        (error: any) => {
          alertDialogRef.close();
          console.log('error===', error);
          this._snackBar.open(error, 'Ok');
        }
      );
  }
}
