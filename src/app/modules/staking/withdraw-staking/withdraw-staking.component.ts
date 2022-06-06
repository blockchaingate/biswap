import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { environment } from 'src/environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-withdraw-staking',
  templateUrl: './withdraw-staking.component.html',
  styleUrls: ['./withdraw-staking.component.scss']
})
export class WithdrawStakingComponent implements OnInit {

  coinAmount: number;
  constructor(
    private _snackBar: MatSnackBar,
    private web3Service: Web3Service,
    private kanbanService: KanbanService) { }

  ngOnInit(): void {
  }

  withdrawStaking() {
    const params = [
      '0x' + new BigNumber(this.coinAmount).shiftedBy(18).toString(16)
    ];

    const abiHex = this.web3Service.withdraw(params);

    this.kanbanService
    .send(environment.smartConractStaking, abiHex)
    .then((data) => {
      console.log('data for withdraw===', data);
      this._snackBar.open(data);
    });
  }
}
