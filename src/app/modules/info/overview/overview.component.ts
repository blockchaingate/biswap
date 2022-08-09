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
  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getDayDatas(100, 0).subscribe((items: any) => {
      console.log('items===', this.items);
      this.items = items.reverse();
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
        console.log('ret===', ret);
        const totalCount = ret.totalCount;
        this.totalPage = Math.floor(totalCount / this.pageSizeTransaction);
      }
    );
  }

  changePageNumTransaction(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    if(pageNum > this.totalPage) {
      pageNum = this.totalPage;
    }
    this.pageNumTransaction = pageNum;
    this.biswapServ.getTransactions(this.pageSizeTransaction, this.pageNumTransaction).subscribe((transactions: any) => {
      this.transactions = transactions;
    });
  }
}
