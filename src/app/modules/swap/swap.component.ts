import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import BigNumber from 'bignumber.js';
import { Coin } from 'src/app/models/coin';
import { DataService } from 'src/app/services/data.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { StorageService } from 'src/app/services/storage.service';
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

  swapAmount: number;


  needtodecode: string;
  


  constructor(
    private web3Service: Web3Service,
    private walletService: WalletService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private dialog: MatDialog,
    private kanbanService: KanbanService
  ) {

    this.kanbanService.getKanbanStatus().subscribe(
      (res: any) => {
        console.log(res)
          if (res && res.success) {
              const data = res.body;
              if (data != 'live') {
                  console.log(data)
              }
          }
      },
      err => {
          if (environment.production) {
              
          }

          console.log(err);
      })
      ;
  }

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

    this.kanbanService.getTokenList().subscribe((x) => {
      this.tokenList = x;
    });
  }

  async onKey(value: number, isFistToken: boolean) {
    if (
      this.firstToken.tickerName != null &&
      this.secondToken.tickerName != null
    ) {
      await this.getFeePrice(isFistToken, value).then((value) => {
        this.swapAmount = value;
      });
    }
  }

  async getFeePrice(isFirst: boolean, value: number) {
    if (isFirst) {
      this.secondCoinAmount = value * 0.494;
    } else {
      this.firstCoinAmount = value / 0.494;
    }

    return value / 1000;
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
      });
  }

  changeTokens() {
    var temp = this.firstToken;
    this.dataService.sendFirstToken(this.secondToken);
    this.dataService.sendSecondToken(temp);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  connectWallet() {
    this.walletService.connectWallet();
  }
  
  async swapFunction() {
    if (this.swapAmount != null || this.swapAmount != undefined) {

    var amount: number = this.firstCoinAmount;
    var amount1: number = this.secondCoinAmount;
    var amount2: number = this.swapAmount;

    var value = new BigNumber(amount).multipliedBy(new BigNumber(1e18)).toFixed();
    var value1 = new BigNumber(amount1).multipliedBy(new BigNumber(1e18)).toFixed();
    var value2 = new BigNumber(amount2).multipliedBy(new BigNumber(1e18)).toFixed();


  


      value = "10000000"
      value1 = "10000000000"
      value2 = "100000000000"


      console.log(value)
      console.log(value1)
      console.log(value2)

      var params = [
        value,value1,value2
      ]

      var abiHex =  this.web3Service.getTransferFuncABI(params);
      console.log('============------dsdada----------------===============');
      console.log(abiHex);

     this.kanbanService.kanbanCall('0xa2370c422e2074ae2fc3d9d24f1e654c7fa3c181',abiHex).subscribe(data => {
        console.log(data);

        let res: any = data;

        console.log(res.data)

        var valueasd =  this.web3Service.decodeabiHex(res.data);

        console.log(valueasd);

        this.needtodecode = valueasd.toString();
      })


      
      // var walletAddress = this.utilService.fabToExgAddress(
      //   'mh2TK5DyiUmXce4dB7MtRfB9trqKd7fiku'
      // );
  
      // var result = this.web3Service.getBalanceOf([walletAddress]);
      // console.log('result');
      // this.needtodecode = result;
      // console.log(result);
  
      // var fxnCallHex = this.utilService.stripHexPrefix(result);
  
      // //console.log('fxnCallHex for EXGA', fxnCallHex);
      // let response = await this.apiService.fabCallContract(
      //   '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
      //   fxnCallHex
      // );
  
      // // console.log('response=', response);
      // let balance = 0;
      // if (
      //   response &&
      //   response.executionResult &&
      //   response.executionResult.output
      // ) {
      //   const balanceHex = response.executionResult.output;
      //   balance = parseInt(balanceHex, 16);
  
      //   console.log('balance');
      //   console.log(balance);
      // }

    }
    
  
  }

  async send(to: string, value: string, data: any, session: any) {
    const tx = {
      to: to,
      value: value,
      data: data,
    };
    const requestBody = {
      topic: session.topic,
      chainId: session.permissions.blockchain.chains[0],
      request: {
        method: 'kanban_sendTransaction',
        params: [tx],
      },
    };

    console.log(requestBody);
  }
}
