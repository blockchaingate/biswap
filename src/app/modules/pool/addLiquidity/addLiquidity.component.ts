import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import BigNumber from 'bignumber.js';
import { Coin } from 'src/app/models/coin';
import { DataService } from 'src/app/services/data.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';
import { TokenListComponent } from '../../shared/tokenList/tokenList.component';

@Component({
  selector: 'app-addLiquidity',
  templateUrl: './addLiquidity.component.html',
  styleUrls: ['./addLiquidity.component.scss'],
})
export class AddLiquidityComponent implements OnInit {
  firstToken: Coin = new Coin();
  secondToken: Coin = new Coin();
  tokenList: Coin[];

  isWalletConnect: boolean = true;

  firstCoinAmount: number;
  secondCoinAmount: number;

  swapAmount: number;

  needtodecode: any;

  constructor(
    private utilService: UtilsService,
    private storageService: StorageService,
    private web3Service: Web3Service,
    private dataService: DataService,
    public dialog: MatDialog,
    private kanbanService: KanbanService
  ) {}

  ngOnInit() {
    this.kanbanService.getTokenList().subscribe((x) => {
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
      await this.getFeePrice(isFistToken, value).then((value) => {
        this.swapAmount = value;
      });
    } else if (value == null && value == undefined) {
      if (isFistToken) {
        this.secondCoinAmount = 0;
      } else {
        this.firstCoinAmount = 0;
      }
    }
  }

  async getFeePrice(isFirst: boolean, value: number) {
    if (isFirst) {
      var amount: number = this.firstCoinAmount;
      var reserve1: BigNumber = new BigNumber(100000000000000000);
      var reserve2: BigNumber = new BigNumber(100000000000000000);

      let value = new BigNumber(amount)
        .multipliedBy(new BigNumber(1e18))
        .toFixed();

      value = value.split('.')[0];

      const params = [value, reserve1, reserve2];

      var abiHex = this.web3Service.quote(params);

      console.log('abiHex => ' + abiHex);

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
      var reserve1: BigNumber = new BigNumber(100000000000000000);
      var reserve2: BigNumber = new BigNumber(100000000000000000);

      let value = new BigNumber(amount)
        .multipliedBy(new BigNumber(1e18))
        .toFixed();

      value = value.split('.')[0];

      const params = [value, reserve1, reserve2];

      var abiHex = this.web3Service.quote(params);

      console.log('abiHex => ' + abiHex);

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

    return value / 1000;
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

          console.log('abiHex => ' + abiHex);

          this.kanbanService
            .kanbanCall(environment.smartConractAdressFactory, abiHex)
            .subscribe((data) => {
              let res: any = data;
              var valueasd = this.web3Service.decodeabiHex(res.data, 'address');
              this.needtodecode = valueasd.toString();
            });

          var abiHexa = this.web3Service.getReserves();

          this.kanbanService
            .kanbanCall('0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc', abiHexa)
            .subscribe((data: any) => {
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

        if (this.firstToken.type != null && this.secondToken.type != null) {
          var params = [this.firstToken.type, this.secondToken.type];

          var abiHex = this.web3Service.getPair(params);

          console.log('abiHex => ' + abiHex);

          this.kanbanService
            .kanbanCall(environment.smartConractAdressFactory, abiHex)
            .subscribe((data) => {
              let res: any = data;
              var valueasd = this.web3Service.decodeabiHex(res.data, 'address');
              this.needtodecode = valueasd.toString();
            });

          var abiHexa = this.web3Service.getReserves();

          this.kanbanService
            .kanbanCall('0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc', abiHexa)
            .subscribe((data: any) => {
              var param = ['uint112', 'uint112', 'uint32'];
              var value = this.web3Service.decodeabiHexs(data.data, param);
              console.log('value =>' + value[0]);
              console.log('value =>' + value[1]);
              console.log('value =>' + value[2]);
            });
        }
      });
  }

  addLiqudity() {
    const addressArray = this.storageService
      .getWalletSession()
      .state.accounts[0].split(':');
    const walletAddress = addressArray[addressArray.length - 1];

    let amountADesired = new BigNumber(this.firstCoinAmount)
      .multipliedBy(new BigNumber(1e18))
      .toFixed();
    let amountBDesired = new BigNumber(this.secondCoinAmount)
      .multipliedBy(new BigNumber(1e18))
      .toFixed();

    var tokenA = this.firstToken.type;
    var tokenB = this.secondToken.type;

    var amountADesireda = new BigNumber(amountADesired);
    var amountBDesireda = new BigNumber(amountBDesired);

    var amountAMin = new BigNumber(Number(amountADesired) - 1000);
    var amountBMin = new BigNumber(Number(amountBDesired) - 1000);
    var to = this.utilService.fabToExgAddress(walletAddress);
    var deadline = 1652408085;

    const params = [
      tokenA,
      tokenB,
      amountADesireda,
      amountBDesireda,
      amountAMin,
      amountBMin,
      to,
      deadline,
    ];

    var abiHex = this.web3Service.addLiquidity(params);

    console.log('abiHex');
    console.log(abiHex);

    var decode = this.web3Service.decodeabiHexs(abiHex, [
      'uint256',
      'uint256',
      'uint256',
    ]);

    console.log('decode');
    console.log(decode);

    this.kanbanService
      .send(environment.smartConractAdressRouter, abiHex)
      .then((data) => {
        console.log('data');
        console.log(data);
        this.needtodecode =
          'https://test.exchangily.com/explorer/tx-detail/' + data;
      });
  }
}
