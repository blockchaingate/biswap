import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { environment } from 'src/environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import BigNumber from 'bignumber.js';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-add-staking',
  templateUrl: './add-staking.component.html',
  styleUrls: ['./add-staking.component.scss']
})
export class AddStakingComponent implements OnInit {
  account: string = '';
  coinAmount!: number;
  constructor(
    private _snackBar: MatSnackBar,
    private web3Service: Web3Service,
    private walletService: WalletService,
    private kanbanService: KanbanService) { }

  ngOnInit(): void {
    this.account = this.walletService.account;
    if(!this.account) {
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
        }
      );
    }
  }

  connectWallet() {
    this.walletService.connectWalletNew();
  }
  
  addStaking() {
    const params = [
      '0x' + new BigNumber(this.coinAmount).shiftedBy(18).toString(16)
    ];

    const abiHex = this.web3Service.deposit(params);

    this.kanbanService
    .send(environment.smartConractStaking, abiHex)
    .then((data) => {
      console.log('data for deposit===', data);
      this._snackBar.open(data);
    });
  }
}
