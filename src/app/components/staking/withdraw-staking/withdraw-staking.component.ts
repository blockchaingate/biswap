import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import BigNumber from 'bignumber.js';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-withdraw-staking',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatFormFieldModule, FormsModule, TranslateModule],
  templateUrl: './withdraw-staking.component.html',
  styleUrls: ['./withdraw-staking.component.scss']
})
export class WithdrawStakingComponent implements OnInit {
  coinAmount!: number;

  constructor(
    private _snackBar: MatSnackBar,
    private web3Service: Web3Service,
    private kanbanService: KanbanService) { }

  ngOnInit(): void {
  }

  withdrawStaking() {
    /*
    const params = [
      '0x' + new BigNumber(this.coinAmount).shiftedBy(18).toString(16)
    ];

    const abiHex = this.web3Service.withdraw(params);

    this.kanbanService
    .send(environment.smartConractStaking, abiHex)
    .then((data) => {
      console.log('data for withdraw===', data);
      this._snackBar.open(data);
    }).catch(
      (error: any) => {
        console.log('error===', error);
        this._snackBar.open(error, 'Ok');
      }
    );;
    */
  }
}
