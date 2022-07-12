import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import BigNumber from 'bignumber.js';
import { ErrorMessagesComponent } from 'src/app/components/errorMessages/errorMessages.component';
import { Coin } from 'src/app/models/coin';
import { TimestampModel } from 'src/app/models/temistampModel';
import { BiswapService } from 'src/app/services/biswap.service';
import { DataService } from 'src/app/services/data.service';
import { KanbanMiddlewareService } from 'src/app/services/kanban.middleware.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';
import { TokenListComponent } from '../shared/tokenList/tokenList.component';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {
  @ViewChild('token1') token1Element: ElementRef;
  @ViewChild('token2') token2Element: ElementRef;
  firstToken: Coin = new Coin();
  secondToken: Coin = new Coin();
  tokenList: Coin[];

  walletSession: any;

  account: string;

  firstCoinAmount: number;
  secondCoinAmount: number;

  perAmount: string;
  perAmountLabel: string = '';

  txHash: string;

  isNewPair: boolean = false;

  firstTokenReserve: BigNumber = new BigNumber(0);
  secondTokenReserve: BigNumber = new BigNumber(0);

  constructor(
    private kanbanMiddlewareService: KanbanMiddlewareService,
    private utilService: UtilsService,
    private web3Service: Web3Service,
    private walletService: WalletService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private dialog: MatDialog,
    private kanbanService: KanbanService,
    private biswapServ: BiswapService
  ) {}

  ngOnInit() {
    /*
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
    });
    */
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
          if (
            addeess.toString() != '0x0000000000000000000000000000000000000000'
          ) {
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
                    this.firstTokenReserve = new BigNumber(value[0]);
                    this.secondTokenReserve = new BigNumber(value[1]);
                  } else {
                    this.firstTokenReserve = new BigNumber(value[1]);
                    this.secondTokenReserve = new BigNumber(value[0]);
                  }

                });
              });
            this.isNewPair = false;
          } else {
            this.openDialog(
              'there is no pair, please first add liquidity to create this pair'
            );
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
        if ( x != undefined && x.isFirst) {
          this.dataService.GetFirstToken.subscribe((data) => {
            this.firstToken = data;
          });
        }

        if (this.firstToken.type != null && this.secondToken.type != null) {
          this.kanbanCallMethod();
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
          this.kanbanCallMethod();
        }
      });
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
      //const params = [value, reserve1, reserve2];

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

      this.firstCoinAmount = this.biswapServ.getAmountIn(amount, reserve1, reserve2);

    }

    var perAmount = (this.firstCoinAmount / this.secondCoinAmount).toString();

    this.perAmountLabel =
      this.firstToken.tickerName +
      ' per ' +
      this.secondToken.tickerName;

    this.perAmount = perAmount;   
  }

  changeTokens() {
    var temp = this.firstToken;
    this.dataService.sendFirstToken(this.secondToken);
    this.dataService.sendSecondToken(temp);

    this.firstCoinAmount = 0;
    this.secondCoinAmount = 0;

    this.kanbanCallMethod();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  connectWallet() {
    this.walletService.connectWalletNew();
  }

  async swapFunction() {
    let amountIn = new BigNumber(this.firstCoinAmount)
      .multipliedBy(new BigNumber(1e18))
      .toFixed();
    let amountOutMin = new BigNumber(this.secondCoinAmount / 2)
      .multipliedBy(new BigNumber(1e18))
      .toFixed();

      /*
    const addressArray = this.storageService
      .getWalletSession()
      .state.accounts[0].split(':');
      */

    var path = [this.firstToken.type, this.secondToken.type];

    var to = this.utilService.fabToExgAddress(this.account);
    var timestamp = new TimestampModel(
      0,
      2,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

    const params = [amountIn, amountOutMin, path, to, deadline];

    var abiHex = this.web3Service.swapExactTokensForTokens(params);

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
