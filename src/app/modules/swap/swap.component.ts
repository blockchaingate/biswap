import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import BigNumber from 'bignumber.js';
import { Coin } from 'src/app/models/coin';
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
        if (res && res.success) {
          const data = res.body;
          if (data != 'live') {
          }
        }
      },
      (err) => {
        if (environment.production) {
        }

        console.log(err);
      }
    );
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
    // if (
    //   this.firstToken.tickerName != null 
    //   &&
    //   this.secondToken.tickerName != null
    // ) {
      await this.getFeePrice(isFistToken, value).then((value) => {
        this.swapAmount = value;
      });
    // }
  }
  

  async getFeePrice(isFirst: boolean, value: number) {
    if (isFirst) {

      var amount: number = 0.1;
      var amount1: number = 10000;
      var amount2: number = 10000;

      let value = new BigNumber(amount).multipliedBy(new BigNumber(1e18)).toFixed();
      let value1 = new BigNumber(amount1).multipliedBy(new BigNumber(1e18)).toFixed();
      let value2 = new BigNumber(amount2).multipliedBy(new BigNumber(1e18)).toFixed();

      value = value.split('.')[0];

      const params = [value, value1, value2];

      
      var abiHex = this.web3Service.getAmountOut(params);

      console.log('abiHex => ' + abiHex)

      this.kanbanService
      .kanbanCall(environment.smartConractAdressRouter, abiHex)
      .subscribe((data) => {
        console.log('data');
        console.log(data);
        let res: any = data;
        var valueasd = this.web3Service.decodeabiHex(res.data, 'uint256');
        console.log('valueasd')
        console.log(valueasd)
        this.secondCoinAmount = Number(valueasd);
      });

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

        if (this.firstToken.type != null && this.secondToken.type != null) {
          console.log('-------------------------------------------------');

          var params = [this.firstToken.type, this.secondToken.type];

          var abiHex = this.web3Service.getPair(params);

          console.log('abiHex => ' + abiHex);

          this.kanbanService
            .kanbanCall(environment.smartConractAdressFactory, abiHex)
            .subscribe((data) => {
              console.log('data');
              console.log(data);
              let res: any = data;
              var valueasd = this.web3Service.decodeabiHex(res.data, 'address');
              this.needtodecode = valueasd.toString();
            });

          var abiHexa = this.web3Service.getReserves();

          console.log('abiHexa =>' + abiHexa);

          console.log('this.needtodecode =>' + this.needtodecode);

          this.kanbanService
            .kanbanCall('0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc', abiHexa)
            .subscribe((data: any) => {
              console.log('data => ' + data.data);

              var param = ['uint112', 'uint112', 'uint32'];
              var value = this.web3Service.decodeabiHexs(data.data, param);
              console.log('value =>' + value[0]);
              console.log('value =>' + value[1]);
              console.log('value =>' + value[2]);
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
    var abiHex = this.web3Service.getReserves();

    console.log('abiHex => ' + abiHex);

    this.kanbanService
      .kanbanCall(environment.smartConractAdressProxy, abiHex)
      .subscribe((data) => {
        console.log('data');
        console.log(data);

        let res: any = data;

        var valueasd = this.web3Service.decodeabiHex(res.data, 'uint256');

        this.needtodecode = valueasd.toString();
      });
  }

  // async swapFunction() {
  //   if (this.swapAmount != null || this.swapAmount != undefined) {
  //     var amount: number = this.firstCoinAmount;
  //     var amount1: number = this.secondCoinAmount;
  //     var amount2: number = this.swapAmount;

  //     var value = new BigNumber(amount)
  //       .multipliedBy(new BigNumber(1e18))
  //       .toFixed();
  //     var value1 = new BigNumber(amount1)
  //       .multipliedBy(new BigNumber(1e18))
  //       .toFixed();
  //     var value2 = new BigNumber(amount2)
  //       .multipliedBy(new BigNumber(1e18))
  //       .toFixed();

  //     value = '10000000';
  //     value1 = '10000000000';
  //     value2 = '100000000000';

  //     var params = [value, value1, value2];

  //     var abiHex = this.web3Service.getAmountIn(params);

  //     this.kanbanService
  //       .kanbanCall('0xa2370c422e2074ae2fc3d9d24f1e654c7fa3c181', abiHex)
  //       .subscribe((data) => {
  //         console.log(data);

  //         let res: any = data;

  //         var valueasd = this.web3Service.decodeabiHex(res.data);

  //         this.needtodecode = valueasd.toString();
  //       });
  //   }
  // }

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
