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
  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getDayDatas(100, 0).subscribe((items: any) => {
      this.items = items.reverse();
    });

    this.biswapServ.getTokens(10, 0).subscribe((tokens: any) => {
      this.tokens = tokens;
    });

    this.biswapServ.getPairs(10, 0).subscribe((pairs: any) => {
      this.pairs = pairs;
    });

    this.biswapServ.getTransactions(10, 0).subscribe((transactions: any) => {
      this.transactions = transactions;
    });
  }
}
