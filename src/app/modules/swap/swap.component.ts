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
import { SettingsComponent } from './settings/settings.component';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {
  @ViewChild('token1') token1Element: ElementRef;
  @ViewChild('token2') token2Element: ElementRef;
  isFistToken: boolean;
  firstToken: Coin = new Coin();
  secondToken: Coin = new Coin();
  tokenList: Coin[];

  walletSession: any;

  account: string;
  tokenId: string;

  firstCoinAmount: number;
  secondCoinAmount: number;

  perAmount: string;
  perAmountLabel: string = '';

  txHash: string;

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
    console.log('abiHex => ' + abiHex);
    this.kanbanService
      .kanbanCall(environment.smartConractAdressFactory, abiHex)
      .then((data) => {
        data.subscribe((data1) => {
          let res: any = data1;
          var addeess = this.web3Service.decodeabiHex(res.data, 'address');
          this.tokenId = addeess.toString();
        })
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


  async setInputValues(isFirst: boolean) {
    if(this.tokenId == '0x0000000000000000000000000000000000000000') {
      return;
    }
    var abiHexa = this.web3Service.getReserves();
    this.kanbanService
      .kanbanCall(this.tokenId, abiHexa)
      .then((data2) => {
        data2.subscribe((data1) => {
          console.log('data1===', data1);

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


          if (isFirst) {
            var amount: number = this.firstCoinAmount;
            var reserve1: BigNumber = this.firstTokenReserve;
            var reserve2: BigNumber = this.secondTokenReserve;
            let value = new BigNumber(amount)
              .multipliedBy(new BigNumber(1e18))
              .toFixed();
            value = value.split('.')[0];
      
            this.secondCoinAmount = this.biswapServ.getAmountOut(amount, reserve1, reserve2);

          } else {
            var amount: number = this.secondCoinAmount;
            var reserve1: BigNumber = this.firstTokenReserve;
            var reserve2: BigNumber = this.secondTokenReserve;
            let value = new BigNumber(amount)
              .multipliedBy(new BigNumber(1e18))
              .toFixed();
            value = value.split('.')[0];
            const params = [value, reserve2, reserve1];
            var path = [this.firstToken.type, this.secondToken.type];
            console.log('path===', path);
            this.firstCoinAmount = this.biswapServ.getAmountIn(amount, reserve1, reserve2);
      
          }
      
          var perAmount = (this.firstCoinAmount / this.secondCoinAmount).toString();
      
          this.perAmountLabel =
            this.firstToken.tickerName +
            ' per ' +
            this.secondToken.tickerName;
      
          this.perAmount = perAmount;   




        });
        
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

  async swapFunction() {


      /*
    const addressArray = this.storageService
      .getWalletSession()
      .state.accounts[0].split(':');
      */

    

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
        this.txHash = 'https://test.exchangily.com/explorer/tx-detail/' + data;
      });
  }
}

//TODO
//- amountOutMin will be calculated with fee price
//- wallet client will come from local session
