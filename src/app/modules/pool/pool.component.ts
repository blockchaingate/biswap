import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import { Coin } from 'src/app/models/coin';
import { DataService } from 'src/app/services/data.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { StorageService } from 'src/app/services/storage.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Web3Service } from 'src/app/services/web3.service';
import { TokenListComponent } from '../shared/tokenList/tokenList.component';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  firstToken: Coin = new Coin();
  secondToken: Coin = new Coin();
  tokenList: Coin[]
  firstCoinAmount: BigNumber = new BigNumber(0.0)
  secondCoinAmount: BigNumber = new BigNumber(0.0)

  isWalletConnect: boolean = false;

  addLiquidityActive: boolean = false;

  walletSession: any;


  constructor(
    public walletService: WalletService,
    public storageService:StorageService,
    public router: Router,
    private dataService: DataService,
    public dialog: MatDialog,
    private kanbanService: KanbanService,
    private web3Service: Web3Service) {}

  ngOnInit() {

    this.walletSession = this.storageService.getWalletSession();
    if (this.walletSession != null) {
      this.dataService.sendWalletLabel('Disconnect Wallet');
      this.dataService.setIsWalletConnect(true);
    }
    else{
      this.dataService.sendWalletLabel('Connect Wallet');
      this.dataService.setIsWalletConnect(false);
    }

    this.dataService.GetIsWalletConnect.subscribe(data => {
      this.isWalletConnect = data;
    })

    this.kanbanService.getTokenList().subscribe(x => {
      this.tokenList = x;
    })
  }

  openTokenListDialog() {
    this.dialog.open(TokenListComponent, {
      data: this.tokenList
    }).afterClosed().subscribe(x => {
    })
  }

  addLiquidityFunction() {
    this.router.navigate([
      "/pool/add"
    ])
  }

  connectWallet(){
    this.walletService.connectWallet();
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
    var abiHex = this.web3Service.getAmountIn('a');
    var txHex = this.web3Service.signAbiHexWithPrivateKey(abiHex,'0xa2370c422e2074ae2fc3d9d24f1e654c7fa3c181', '0xa2370c422e2074ae2fc3d9d24f1e654c7fa3c181', 1 )
    console.log('abiHex')
    console.log(abiHex)
    console.log('txHex')
    console.log(txHex)
  }

}
