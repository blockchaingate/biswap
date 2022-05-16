import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import BigNumber from 'bignumber.js';
import { Coin } from 'src/app/models/coin';
import { TimestampModel } from 'src/app/models/temistampModel';
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

  perAmount: string;
  perAmountLabel: string = '';

  needtodecode: any;

  firstTokenReserve: BigNumber = new BigNumber(0);
  secondTokenReserve: BigNumber = new BigNumber(0);

  constructor(
    private utilService: UtilsService,
    private storageService: StorageService,
    private web3Service: Web3Service,
    private dataService: DataService,
    public dialog: MatDialog,
    private kanbanService: KanbanService
  ) {}

  ngOnInit() {
    this.dataService.GettokenList.subscribe((x) => {
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

  setInputValues(isFirst: boolean) {
    if (isFirst) {
      var amount: number = this.firstCoinAmount;
      var reserve1: BigNumber = this.firstTokenReserve;
      var reserve2: BigNumber = this.secondTokenReserve;

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
      var reserve1: BigNumber = this.firstTokenReserve;
      var reserve2: BigNumber = this.secondTokenReserve;

      let value = new BigNumber(amount)
        .multipliedBy(new BigNumber(1e18))
        .toFixed();

      value = value.split('.')[0];

      const params = [value, reserve2, reserve1];

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
  }

  kanbanCallMethod() {
    var params = [this.firstToken.type, this.secondToken.type];

    var abiHex = this.web3Service.getPair(params);

    console.log('abiHex => ' + abiHex);

    this.kanbanService
      .kanbanCall(environment.smartConractAdressFactory, abiHex)
      .subscribe((data) => {
        let res: any = data;
        var addeess = this.web3Service.decodeabiHex(res.data, 'address');
        this.needtodecode = addeess.toString();

        var abiHexa = this.web3Service.getReserves();

        this.kanbanService
          .kanbanCall(addeess.toString(), abiHexa)
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

            var perAmount = (value[0] / value[1]).toString();

            this.perAmountLabel =
              this.firstToken.tickerName +
              ' per ' +
              this.secondToken.tickerName;

            this.perAmount = perAmount;
          });
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
    var timestamp = new TimestampModel(
      0,
      2,
      0,
      0 // here need to set for future timestamp
    );
    var deadline = this.utilService.getTimestamp(timestamp);

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

    this.kanbanService
      .send(environment.smartConractAdressRouter, abiHex)
      .then((data) => {
        this.needtodecode =
          'https://test.exchangily.com/explorer/tx-detail/' + data;
      });
  }
}
