import { Component, OnInit, Input } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  tokens: any;
  transactions: any;
  pairs: any;
  items: any;
  pageSizeTransaction = 10;
  pageNumTransaction = 0;
  countTransaction = 0;
  totalPage = 0;

  currentLiquidity!: number | Object;
  currentVolume!: number | Object;  
  currentTime!: string;

  formattedDates = [];
  dailyVolumeUntrackedValues = [];
  totalLiquidityFAB = [];
  isItemLoaded = false;


  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.currentLiquidity = 0;
    this.currentTime = '';

    this.biswapServ.getDayDatas(100, 0).subscribe((items: any) => {
      console.log('items===', this.items);
      this.items = items.reverse();

      this.formattedDates = this.items.map(obj => {
       return  this.converTime(obj.date);
      });

      this.dailyVolumeUntrackedValues = this.items.map(obj => obj.dailyVolumeUntracked);

      this.totalLiquidityFAB = this.items.map(obj => obj.totalLiquidityFAB);

      const currentItem = this.items[this.items.length - 1];
      console.log('currentItem=====', currentItem);
      this.currentLiquidity = currentItem.totalLiquidityFAB;
      this.currentVolume = currentItem.dailyVolumeUntracked;
      this.currentTime = this.converTime(currentItem.date);

      this.isItemLoaded = true;

    });

    this.biswapServ.getTokens(10, 0).subscribe((tokens: any) => {
      this.tokens = tokens;
    });

    this.biswapServ.getPairs(10, 0).subscribe((pairs: any) => {
      this.pairs = pairs;
    });

    this.biswapServ.getTransactions(this.pageSizeTransaction, this.pageNumTransaction).subscribe((transactions: any) => {
      this.transactions = transactions;
    });
    this.biswapServ.getCountTransactions().subscribe(
      (ret: any) => {
        const totalCount = ret.totalCount;
        this.totalPage = Math.floor(totalCount / this.pageSizeTransaction);
      }
    );
  }

  converTime(time: number) {
    const date = new Date(time * 1000); // Convert Unix timestamp to JavaScript date
        const month = date.getMonth() + 1; // Month is zero-based, so add 1
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
  }

  changePageNumTransaction(pageNum: number) {
    if (pageNum < 0) {
      pageNum = 0;
    }
    if (pageNum > this.totalPage) {
      pageNum = this.totalPage;
    }
    this.pageNumTransaction = pageNum;
    this.biswapServ.getTransactions(this.pageSizeTransaction, this.pageNumTransaction).subscribe((transactions: any) => {
      this.transactions = transactions;
    });
  }
}
