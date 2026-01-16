import { Component, OnInit } from '@angular/core';
import { StakeService } from 'src/app/services/stake.service';
import { StakesDataSource } from '../stakes-datasource';
import BigNumber from 'bignumber.js';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-withdraws',
  standalone: true,
  imports: [FormsModule, MatTableModule, MatPaginatorModule, TranslateModule],
  templateUrl: './withdraws.component.html',
  styleUrls: ['./withdraws.component.scss']
})
export class WithdrawsComponent implements OnInit {

  pageSize = 10;

  pageNum = 0;
  totalCount = 100;
  account: string = '';
  displayedColumns: string[] = ['position', 'event', 'amount', 'status', 'timestamp'];
  dataSource!: StakesDataSource;
  constructor(
    private stakeServ: StakeService) { }

  ngOnInit(): void {
    //this.dataSource = [{position: 1, event: 'Deposit', amount: 12, status: '2'}];
    this.dataSource = new StakesDataSource(this.stakeServ);
    //this.account = this.walletService.account;
    this.getStakeWithdrawsTotalCount();

  }

  changePage(event: any) {
    const pageSize = event.pageSize;
    const pageIndex = event.pageIndex;
    this.pageSize = pageSize;
    this.pageNum = pageIndex;
    this.loadStakeWithdraws();
  }
  loadStakeWithdraws() {
    this.dataSource.loadStakeWithdraws(this.pageSize, this.pageNum);
  }

  showAmount(amount: any) {
    return new BigNumber(amount).shiftedBy(-18).toNumber();
  }

  showTime(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleString()
  }
  getStakeWithdrawsTotalCount() {
    this.stakeServ.getStakeWithdrawsTotalCount().subscribe(
      (ret: any) => {
        this.totalCount = ret.totalCount;
        this.loadStakeWithdraws();
      }
    );
  }

}
