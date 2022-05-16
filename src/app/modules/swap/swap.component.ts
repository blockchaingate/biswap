import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import BigNumber from 'bignumber.js';
import { Coin } from 'src/app/models/coin';
import { TimestampModel } from 'src/app/models/temistampModel';
import { DataService } from 'src/app/services/data.service';
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

  isWalletConnect: boolean = false;

  firstCoinAmount: number;
  secondCoinAmount: number;

  perAmount: string;
  perAmountLabel: string = '';

  needtodecode: string;

  firstTokenReserve: BigNumber = new BigNumber(0);
  secondTokenReserve: BigNumber = new BigNumber(0);

  constructor(
    private utilService: UtilsService,
    private web3Service: Web3Service,
    private walletService: WalletService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private dialog: MatDialog,
    private kanbanService: KanbanService
  ) {}

  ngOnInit() {
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

    this.dataService.GettokenList
    .subscribe((x) => {
      this.tokenList = x;
    });
  }

  async onKey(value: number, isFistToken: boolean) {
    console.log(value);
    console.log(isFistToken);

    if (
      this.firstToken.tickerName != null &&
      this.secondToken.tickerName != null &&
      value != null &&
      value != undefined
    ) {
      await this.setInputValues(isFistToken);
    } else if (value == null && value == undefined) {
      if (isFistToken) {
        this.secondCoinAmount = 0;
      } else {
        this.firstCoinAmount = 0;
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
          var params = [this.firstToken.type, this.secondToken.type];

          var abiHex = this.web3Service.getPair(params);

          this.kanbanService
            .kanbanCall(environment.smartConractAdressFactory, abiHex)
            .subscribe((data) => {
              let res: any = data;

              var address = this.web3Service.decodeabiHex(res.data, 'address');

              this.needtodecode = address.toString();

              var abiHexa = this.web3Service.getReserves();

              this.kanbanService
                .kanbanCall(address.toString(), abiHexa)
                .subscribe((data: any) => {
                  var param = ['uint112', 'uint112', 'uint32'];
                  var value = this.web3Service.decodeabiHexs(data.data, param);

                  if (this.firstToken.type > this.secondToken.type) {
                    this.firstTokenReserve = value[0];
                    this.secondTokenReserve = value[1];
                  } else {
                    this.firstTokenReserve = value[1];
                    this.secondTokenReserve = value[0];
                  }
                  this.perAmount = (value[1] / value[0]).toString();

                  this.perAmountLabel =
                    this.firstToken.tickerName +
                    ' per ' +
                    this.secondToken.tickerName;
                });
            });
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
        if (x.isSecond) {
          this.dataService.GetSecondToken.subscribe((data) => {
            this.secondToken = data;
          });
        }

        if (this.firstToken.type != null && this.secondToken.type != null) {
          var params = [this.firstToken.type, this.secondToken.type];

          var abiHex = this.web3Service.getPair(params);

          console.log('abiHex => ' + abiHex);

          this.kanbanService
            .kanbanCall(environment.smartConractAdressFactory, abiHex)
            .subscribe((data) => {
              let res: any = data;

              var address = this.web3Service.decodeabiHex(res.data, 'address');

              this.needtodecode = address.toString();

              var abiHexa = this.web3Service.getReserves();

              this.kanbanService
                .kanbanCall(address.toString(), abiHexa)
                .subscribe((data: any) => {
                  var param = ['uint112', 'uint112', 'uint32'];
                  var value = this.web3Service.decodeabiHexs(data.data, param);

                  if (this.firstToken.type < this.secondToken.type) {
                    this.firstTokenReserve = value[0];
                    this.secondTokenReserve = value[1];
                  } else {
                    this.firstTokenReserve = value[1];
                    this.secondTokenReserve = value[0];
                  }

                  this.perAmount = (value[0] / value[1]).toString();

                  this.perAmountLabel =
                    this.firstToken.tickerName +
                    ' per ' +
                    this.secondToken.tickerName;
                });
            });
        }
      });
  }

  setInputValues(isFirst: boolean) {
    if (isFirst) {
      var amount: number = this.firstCoinAmount;

      let value = new BigNumber(amount)
        .multipliedBy(new BigNumber(1e18))
        .toFixed();

      value = value.split('.')[0];

      const params = [value, this.firstTokenReserve, this.secondTokenReserve];

      var abiHex = this.web3Service.quote(params);

      this.kanbanService
        .kanbanCall(environment.smartConractAdressRouter, abiHex)
        .subscribe((data) => {
          let res: any = data;

          var result = this.web3Service.decodeabiHex(res.data, 'uint256');

          var temp = Number(result);
          this.secondCoinAmount = Number(
            new BigNumber(temp).dividedBy(new BigNumber(1e18)).toFixed()
          );
        });
    } else {
      var amount: number = this.secondCoinAmount;

      let value = new BigNumber(amount)
        .multipliedBy(new BigNumber(1e18))
        .toFixed();

      value = value.split('.')[0];

      const params = [value, this.firstTokenReserve, this.secondTokenReserve];

      var abiHex = this.web3Service.quote(params);

      this.kanbanService
        .kanbanCall(environment.smartConractAdressRouter, abiHex)
        .subscribe((data) => {
          let res: any = data;
          var result = this.web3Service.decodeabiHex(res.data, 'uint256');

          var temp = Number(result);

          this.firstCoinAmount = Number(
            new BigNumber(temp).dividedBy(new BigNumber(1e18))
          );
        });
    }
  }

  changeTokens() {
    var temp = this.firstToken;
    this.dataService.sendFirstToken(this.secondToken);
    this.dataService.sendSecondToken(temp);

    var tempAmount = this.firstCoinAmount;
    this.firstCoinAmount = this.secondCoinAmount;
    this.secondCoinAmount = tempAmount;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  connectWallet() {
    this.walletService.connectWallet();
  }

  async swapFunction() {
    let amountIn = new BigNumber(this.firstCoinAmount)
      .multipliedBy(new BigNumber(1e18))
      .toFixed();
    let amountOutMin = new BigNumber(this.secondCoinAmount / 2)
      .multipliedBy(new BigNumber(1e18))
      .toFixed();

    const addressArray = this.storageService
      .getWalletSession()
      .state.accounts[0].split(':');
    const walletAddress = addressArray[addressArray.length - 1];

    var path = [this.firstToken.type, this.secondToken.type];

    var to = this.utilService.fabToExgAddress(walletAddress);
    var timestamp = new TimestampModel(
      0,2,0,0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

    const params = [amountIn, amountOutMin, path, to, deadline];

    var abiHex = this.web3Service.swapExactTokensForTokens(params);

    this.kanbanService
      .send(environment.smartConractAdressRouter, abiHex)
      .then((data) => {
        this.needtodecode =
          'https://test.exchangily.com/explorer/tx-detail/' + data;
      });
  }
}



//TODO
//- timestamp will be functional  -  done
//- amountOutMin will be calculated with fee price 
//- wallet client will come from local session