import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { StakeService } from 'src/app/services/stake.service';
import { StakesDataSource } from './stakes-datasource';

export interface PeriodicElement {
  event: string;
  position: number;
  amount: number;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-staking-history',
  templateUrl: './staking-history.component.html',
  styleUrls: ['./staking-history.component.scss']
})
export class StakingHistoryComponent implements OnInit {
  pageSize = 10;
  pageNum = 0;
  totalCount = 100;
  account: string;
  displayedColumns: string[] = ['position', 'event', 'amount', 'status'];
  dataSource: StakesDataSource;
  constructor(
    private walletService: WalletService,
    private stakeServ: StakeService) { }

  ngOnInit(): void {
    //this.dataSource = [{position: 1, event: 'Deposit', amount: 12, status: '2'}];
    this.dataSource = new StakesDataSource(this.stakeServ);
    this.account = this.walletService.account;
    this.getStakesTotalCount();
    this.walletService.accountSubject.subscribe(
      account => {
        this.account = account;
        this.getStakesTotalCount();
      }
    );
  }

  loadStakes() {

    this.dataSource.loadStakes(this.account, this.pageSize, this.pageNum);
  }

  getStakesTotalCount() {
    if(!this.account) {
      return;
    }
    this.stakeServ.getStakesTotalCountByUser(this.account).subscribe(
      (ret: any) => {
        this.totalCount = ret.totalCount;
        this.loadStakes();
        
      }
    );
  }
}
