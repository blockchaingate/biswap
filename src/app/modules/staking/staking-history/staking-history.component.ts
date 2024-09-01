import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { StakeService } from 'src/app/services/stake.service';
import { StakesDataSource } from '../stakes-datasource';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-staking-history',
  templateUrl: './staking-history.component.html',
  styleUrls: ['./staking-history.component.scss']
})
export class StakingHistoryComponent implements OnInit {
  pageSize = 10;

  pageNum = 0;
  totalCount = 100;
  account: string = '';
  displayedColumns: string[] = ['position', 'event', 'amount', 'status', 'timestamp'];
  dataSource!: StakesDataSource;
  constructor(
    private walletService: WalletService,
    private stakeServ: StakeService) { }

  ngOnInit(): void {
    //this.dataSource = [{position: 1, event: 'Deposit', amount: 12, status: '2'}];
    this.dataSource = new StakesDataSource(this.stakeServ);
    this.account = this.walletService.account;
    //this.account = 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR';
    this.getStakesTotalCount();
    this.walletService.accountSubject.subscribe(
      account => {
        this.account = account;
        this.getStakesTotalCount();
      }
    );
  }

  changePage(event: any) {
    const pageSize = event.pageSize;
    const pageIndex = event.pageIndex;
    this.pageSize = pageSize;
    this.pageNum = pageIndex;
    this.loadStakes();
  }
  loadStakes() {
    console.log('this.pageSize===', this.pageSize);
    this.dataSource.loadStakes(this.account, this.pageSize, this.pageNum);
  }

  showAmount(amount: any) {
    return new BigNumber(amount).shiftedBy(-18).toNumber();
  }

  showTime(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleString()
  }
  getStakesTotalCount() {
    if (!this.account) {
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
