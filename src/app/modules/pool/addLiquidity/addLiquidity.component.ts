import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import BigNumber from 'bignumber.js';
import { Coin } from 'src/app/models/coin';
import { DataService } from 'src/app/services/data.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { Web3Service } from 'src/app/services/web3.service';
import { TokenListComponent } from '../../shared/tokenList/tokenList.component';

@Component({
  selector: 'app-addLiquidity',
  templateUrl: './addLiquidity.component.html',
  styleUrls: ['./addLiquidity.component.scss']
})
export class AddLiquidityComponent implements OnInit {
  firstToken: Coin = new Coin();
  secondToken: Coin = new Coin();
  tokenList: Coin[];

  isWalletConnect: boolean = true;

  firstCoinAmount: BigNumber;
  secondCoinAmount: BigNumber;

  swapAmount: BigNumber = new BigNumber(0.0);


  constructor(
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

  callRPC(){
    var abiHex = this.web3Service.getTransferFuncABI('a');
    console.log('abiHex')
    console.log(abiHex)
  }
}

