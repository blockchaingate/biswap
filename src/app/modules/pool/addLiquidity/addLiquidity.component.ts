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
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';
import { TokenListComponent } from '../../shared/tokenList/tokenList.component';

@Component({
  selector: 'app-addLiquidity',
  templateUrl: './addLiquidity.component.html',
  styleUrls: ['./addLiquidity.component.scss'],
})
export class AddLiquidityComponent implements OnInit {
  slipery = 0.05;
  firstToken: Coin = new Coin();
  secondToken: Coin = new Coin();
  tokenList: Coin[];

  isWalletConnect: boolean = true;

  firstCoinAmount: number;
  secondCoinAmount: number;
  account: string;

  perAmount: string;
  perAmountLabel: string = '';

  txHash: String;
  newPair: String;

  isNewPair: boolean = false;

  firstTokenReserve: BigNumber = new BigNumber(0);
  secondTokenReserve: BigNumber = new BigNumber(0);

  //walletAddress:string;
  pairAddress: string;

  constructor(
    private kanbanMiddlewareService: KanbanMiddlewareService,
    private utilService: UtilsService,
    private web3Service: Web3Service,
    private dataService: DataService,
    public dialog: MatDialog,
    private kanbanService: KanbanService,
    private walletService: WalletService,
    private currentRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
  ) {}

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
      if (type[3] == "token") {
        let params: any = x;
        this.apiService.getTokenInfoFromId(params.tokenid).subscribe((res: any) =>{
          let first = res["name"];
          this.firstToken = this.tokenList.find(x => x.tickerName == first) || new Coin();
})  
      } else {
        let params: any = x;
         this.apiService.getTokensInfoFromPair(params.tokenid).subscribe((res: any) =>{
          alert('s--' + JSON.stringify(res))
              let first = res["token0Name"];
              let sescond = res["token1Name"];
              this.firstToken = this.tokenList.find(x => x.tickerName == first) || new Coin();
              this.secondToken = this.tokenList.find(x => x.tickerName == sescond) || new Coin();
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
    var params = [this.firstToken.type, this.secondToken.type];
    var abiHex = this.web3Service.getPair(params);
    console.log('abiHex => ' + abiHex);
    this.kanbanService
      .kanbanCall(environment.smartConractAdressFactory, abiHex)
      .then((data) => {
        data.subscribe((data1) => {
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
              .then((data2) => {
                data2.subscribe((data3) => {
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
              });
            this.isNewPair = false;
            this.newPair = '';
          } else {
            this.newPair = 'You are adding liquidity to new pair';
            this.isNewPair = true;
          }
        });
      })
      .catch((error) => {
        this.openDialog(error);
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
        if (x.isFirst) {
          this.dataService.GetFirstToken.subscribe((data) => {
            this.firstToken = data;
          });
        }

        if (this.firstToken.type != null && this.secondToken.type != null) {
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
        if (x.isSecond) {
          this.dataService.GetSecondToken.subscribe((data) => {
            this.secondToken = data;
          });
        }

        if (this.firstToken.type != null && this.secondToken.type != null) {
          this.kanbanCallMethod();
        }
      });
  }

  addLiqudity() {
    /*
    const addressArray = this.storageService
      .getWalletSession()
      .state.accounts[0].split(':');
    
    this.walletAddress = addressArray[addressArray.length - 1];
*/
    let amountADesired = '0x' + new BigNumber(this.firstCoinAmount)
      .multipliedBy(new BigNumber(1e18))
      .toString(16).split('.')[0];
    let amountBDesired = '0x' + new BigNumber(this.secondCoinAmount)
      .multipliedBy(new BigNumber(1e18))
      .toString(16).split('.')[0];

    var tokenA = this.firstToken.type;
    var tokenB = this.secondToken.type;

    //var amountADesireda = '0x' + new BigNumber(amountADesired).toString(16);
    //var amountBDesireda = '0x' + new BigNumber(amountBDesired).toString(16);

    var amountAMin = '0x' + new BigNumber(this.firstCoinAmount)
    .multipliedBy(new BigNumber(1).minus(new BigNumber(this.slipery))).multipliedBy(new BigNumber(1e18))
    .toString(16).split('.')[0];
    var amountBMin = '0x' + new BigNumber(this.secondCoinAmount)
    .multipliedBy(new BigNumber(1).minus(new BigNumber(this.slipery))).multipliedBy(new BigNumber(1e18))
    .toString(16).split('.')[0];
    var to = this.utilService.fabToExgAddress(this.account);
    var timestamp = new TimestampModel(
      0,
      5,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

    const params = [
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline,
    ];

    console.log('params====', params);
    var abiHex = this.web3Service.addLiquidity(params);
    console.log('abiHex====', abiHex);
    this.kanbanService
      .send(environment.smartConractAdressRouter, abiHex)
      .then((data) => {
        this.txHash = 'https://test.exchangily.com/explorer/tx-detail/' + data;
        /*
        const param = {
          userAddress: this.account,
          pairAddress: this.pairAddress,
        };
        this.apiService.sendUserPair(param).subscribe((res: any) => {
          console.log(res);
          console.log(res.data);
        })
        */
      });
  }
}
