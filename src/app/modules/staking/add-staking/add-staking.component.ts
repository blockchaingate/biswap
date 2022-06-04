import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { environment } from 'src/environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-staking',
  templateUrl: './add-staking.component.html',
  styleUrls: ['./add-staking.component.scss']
})
export class AddStakingComponent implements OnInit {

  coinAmount: number;
  constructor(
    private _snackBar: MatSnackBar,
    private web3Service: Web3Service,
    private kanbanService: KanbanService) { }

  ngOnInit(): void {
  }

  addStaking() {
    const params = [
      this.coinAmount
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
