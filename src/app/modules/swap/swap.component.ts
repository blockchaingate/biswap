import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import { ErrorMessagesComponent } from 'src/app/components/errorMessages/errorMessages.component';
import { Coin } from 'src/app/models/coin';
import { TimestampModel } from 'src/app/models/temistampModel';
import { ApiService } from 'src/app/services/api.services';
import { BiswapService } from 'src/app/services/biswap.service';
import { DataService } from 'src/app/services/data.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { UtilsService } from 'src/app/services/utils.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';
import { TokenListComponent } from '../shared/tokenList/tokenList.component';
import { SettingsComponent } from '../settings/settings.component';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {
  minimumReceived!: number;
  maximumSold!: number;
  insufficientFund: boolean = false;
  autorefresh: any;
  priceImpact: number = 0;
  liquidityPrividerFee!: number;
  liquidityPrividerFeeCoin: string = '';
  route: any;
  error: string = '';
  @ViewChild('token1')
  token1Element!: ElementRef;
  @ViewChild('token2')
  token2Element!: ElementRef;
  isFistToken!: boolean;

  _firstToken!: Coin;
  _secondToken!: Coin;

  public get firstToken(): Coin {
    return this._firstToken;
  }

  public set firstToken(coin: Coin) {
    this._firstToken = coin;
    const coinType = coin.type;
    if(this.account && coinType) {
      this.kanbanService.getTokenBalance(this.account, coinType).subscribe(
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
    const coinType = coin.type;
    if(this.account && coinType) {
      this.kanbanService.getTokenBalance(this.account, coinType).subscribe(
        (balance: any) => {
          this.secondCoinBalance = balance;
        }
      );
    }

  }

  tokenList!: Coin[];

  walletSession: any;

  _account!: string;

  public get account(): string {
    return this._account;
  }

  public set account(newAccount: string) {
    this._account = newAccount;
    
    if(newAccount) {
      if(this.firstToken && this.firstToken.type) {
        this.kanbanService.getTokenBalance(newAccount, this.firstToken.type).subscribe(
          (balance: any) => {
            this.firstCoinBalance = balance;
          }
        );
      }

      if(this.secondToken && this.secondToken.type) {
        this.kanbanService.getTokenBalance(newAccount, this.secondToken.type).subscribe(
          (balance: any) => {
            this.secondCoinBalance = balance;
          }
        );
      }
    }
  }
  
  tokenId!: string;

  firstCoinAmount!: number;
  secondCoinAmount!: number;

  perAmount!: string;
  perAmountLabel: string = '';

  secondCoinBalance!: number;
  firstCoinBalance!: number;
  txHash!: string;

  //isNewPair: boolean = false;

  firstTokenReserve: BigNumber = new BigNumber(0);
  secondTokenReserve: BigNumber = new BigNumber(0);
  slippage = 1;
  deadline = 20;
  constructor(
    private utilService: UtilsService,
    private web3Service: Web3Service,
    private walletService: WalletService,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private dialog: MatDialog,
    private kanbanService: KanbanService,
    private biswapServ: BiswapService,
    private currentRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

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
      // this._firstToken = this.tokenList.find(t => t.coinType == 131072) || new Coin();
    });
    this.checkUrlToken();

    this.autorefresh = setInterval(() => {this.refresh()}, 1000);
  }
 
 
  checkUrlToken(){
    this.currentRoute.params.subscribe((x) =>{
      var type = this.router.url.split("/")
      if (type[2] == "token") {
        let params: any = x;
        this.apiService.getTokenInfoFromId(params.tokenid).subscribe((res: any) =>{
          let first = res["name"];
          this.firstToken = this.tokenList.find(x => x.tickerName == first) || new Coin();
})  
      } else {
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
    this.isFistToken = isFistToken;
    if (
      this.firstToken.tickerName != null &&
      this.secondToken.tickerName != null &&
      value != null &&
      value != undefined
    ) {
      await this.setInputValues(isFistToken);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.token1Element.nativeElement.focus();
      this.token2Element.nativeElement.focus();
    }, 0);
  }

  openDialog(errorMessage: String) {
    this.dialog.open(ErrorMessagesComponent, { data: errorMessage });
  }

  getPair() {
    var params = [this.firstToken.type, this.secondToken.type];
    var abiHex = this.web3Service.getPair(params);
    console.log('abiHex  for getPair=> ' + abiHex);
    this.kanbanService
      .kanbanCall(environment.smartConractAdressFactory, abiHex)
      .subscribe((data: any) => {
        console.log('data=====', data);
        /*
        data.subscribe((data1) => {
          let res: any = data1;

        })
        */
        var address = this.web3Service.decodeabiHex(data.data, 'address');
        console.log('address===', address);
        this.tokenId = address.toString();
        console.log('this.tokenId===', this.tokenId);
      });
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
        if ( x != undefined && x.isFirst) {
          this.dataService.GetFirstToken.subscribe((data) => {
            this.firstToken = data;
          });
        }

        if (this.firstToken.type != null && this.secondToken.type != null) {
          this.getPair();
        }
      });
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
        if (x != undefined && x.isSecond) {
          this.dataService.GetSecondToken.subscribe((data) => {
            this.secondToken = data;
          });
        }

        if (this.firstToken.type != null && this.secondToken.type != null) {
          this.getPair();
        }
      });
  }

  ngOnDestroy() {
    if(this.autorefresh) {
      clearInterval(this.autorefresh);
    }
  }

  async setInputValues(isFirst: boolean) {
    if(!this.tokenId || (this.tokenId == '0x0000000000000000000000000000000000000000')) {
      return;
    }
    var abiHexa = this.web3Service.getReserves();
    this.kanbanService
      .kanbanCall(this.tokenId, abiHexa)
      .subscribe((data1) => {

          var param = ['uint112', 'uint112', 'uint32'];
          let res: any = data1;

          var value = this.web3Service.decodeabiHexs(res.data, param);

          if (this.firstToken.type < this.secondToken.type) {
            this.firstTokenReserve = new BigNumber(value[0]);
            this.secondTokenReserve = new BigNumber(value[1]);
          } else {
            this.firstTokenReserve = new BigNumber(value[1]);
            this.secondTokenReserve = new BigNumber(value[0]);
          }


          if (isFirst && this.firstCoinAmount) {
            var amount: number = this.firstCoinAmount;
            this.insufficientFund = (Number(amount) > Number(this.firstCoinBalance));
            var reserve1: BigNumber = this.firstTokenReserve;
            var reserve2: BigNumber = this.secondTokenReserve;
            let value = '0x' + new BigNumber(amount)
              .shiftedBy(18)
              .toString(16);
            value = value.split('.')[0];
      
            this.secondCoinAmount = this.biswapServ.getAmountOut(amount, reserve1, reserve2);

            this.liquidityPrividerFee = new BigNumber(amount).multipliedBy(new BigNumber(0.003)).toNumber();
            this.liquidityPrividerFeeCoin = this.firstToken.tickerName;
            this.maximumSold = 0;
            this.minimumReceived = new BigNumber(this.secondCoinAmount).multipliedBy(new BigNumber(1-this.slippage * 0.01)).toNumber();            
          } else 
          if(!isFirst && this.secondCoinAmount)
          {
            var amount: number = this.secondCoinAmount;
            this.insufficientFund = (Number(amount) > Number(this.secondCoinBalance));
            var reserve1: BigNumber = this.firstTokenReserve;
            var reserve2: BigNumber = this.secondTokenReserve;
            let value = new BigNumber(amount)
              .shiftedBy(18)
              .toString(16);
            value = value.split('.')[0];
            const params = [value, reserve2, reserve1];
            var path = [this.firstToken.type, this.secondToken.type];
            this.firstCoinAmount = this.biswapServ.getAmountIn(amount, reserve1, reserve2);
            this.liquidityPrividerFee = new BigNumber(amount).multipliedBy(new BigNumber(0.003)).toNumber();
            this.liquidityPrividerFeeCoin = this.secondToken.tickerName;
            this.minimumReceived = 0;
            this.maximumSold = new BigNumber(this.firstCoinAmount).multipliedBy(new BigNumber(1+this.slippage * 0.01)).toNumber();
          }
      
          if((isFirst && this.firstCoinAmount) || (!isFirst && this.secondCoinAmount)) {
            var perAmount = (this.firstCoinAmount / this.secondCoinAmount);
      
            this.perAmountLabel =
              this.firstToken.tickerName +
              ' per ' +
              this.secondToken.tickerName;
        
            this.perAmount = perAmount.toString();   
  
            const currentPerAmount = this.firstTokenReserve.dividedBy(this.secondTokenReserve).toNumber();
            const diff = perAmount > currentPerAmount ? (perAmount - currentPerAmount) : (currentPerAmount - perAmount);
            this.priceImpact = Number((diff / perAmount * 100).toFixed(2));
  
            this.route = [this.firstToken.tickerName, this.secondToken.tickerName];
          }

      });

  }

  changeTokens() {
    var temp = this.firstToken;
    this.dataService.sendFirstToken(this.secondToken);
    this.dataService.sendSecondToken(temp);

    this.firstCoinAmount = 0;
    this.secondCoinAmount = 0;

    //this.kanbanCallMethod();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  connectWallet() {
    this.walletService.connectWalletNew();
  }

  refresh() {
    if(this.account) {
      if(this.firstToken && this.firstToken.type) {
        this.kanbanService.getTokenBalance(this.account, this.firstToken.type).subscribe(
          (balance: any) => {
            this.firstCoinBalance = balance;
          }
        );
      }
  
      if(this.secondToken && this.secondToken.type) {
        this.kanbanService.getTokenBalance(this.account, this.secondToken.type).subscribe(
          (balance: any) => {
            this.secondCoinBalance = balance;
          }
        );
      }
    }

    this.setInputValues(this.isFistToken);
  }

  async swapFunction() {
    if(!this.firstCoinAmount ||
      !this.secondCoinAmount ||
      !this.firstCoinBalance || 
      !this.secondCoinBalance ||
      (this.firstCoinAmount > this.firstCoinBalance) ||
      (this.secondCoinAmount > this.secondCoinBalance)) {
        this.error = 'Not enough balance';
        return;
      }
    var to = this.utilService.fabToExgAddress(this.account);
    var timestamp = new TimestampModel(
      this.deadline,
      0,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

    

    let abiHex = '';
    if(this.isFistToken) {
      var path = [this.firstToken.type, this.secondToken.type];
      const amountIn = '0x' + new BigNumber(this.firstCoinAmount)
      .multipliedBy(new BigNumber(1e18))
      .toString(16).split('.')[0];
      const amountOutMin = '0x' + new BigNumber(this.secondCoinAmount).multipliedBy(new BigNumber(1-this.slippage * 0.01))
      .multipliedBy(new BigNumber(1e18))
      .toString(16).split('.')[0];
      const params = [amountIn, amountOutMin, path, to, deadline];
      abiHex = this.web3Service.swapExactTokensForTokens(params);
    } else {
      var path = [this.firstToken.type, this.secondToken.type];
      const amountOut = '0x' + new BigNumber(this.secondCoinAmount)
      .multipliedBy(new BigNumber(1e18))
      .toString(16).split('.')[0];
      const amountInMax = '0x' + new BigNumber(this.firstCoinAmount).multipliedBy(new BigNumber(1+this.slippage * 0.01))
      .multipliedBy(new BigNumber(1e18))
      .toString(16).split('.')[0];
      const params = [amountOut, amountInMax, path, to, deadline];
      abiHex = this.web3Service.swapTokensForExactTokens(params);
    }

    this.kanbanService
      .send(environment.smartConractAdressRouter, abiHex)
      .then((data) => {
        const baseUrl = environment.production ? 'https://www.exchangily.com' : 'https://test.exchangily.com';
        this.txHash = baseUrl + '/explorer/tx-detail/' + data;
        
      });
  }
}

//TODO
//- amountOutMin will be calculated with fee price
//- wallet client will come from local session
