import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  pair: any;
  pairName: string;
  transactions: any;
  constructor(private biswapServ: BiswapService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(paramsId => {
      const identity = paramsId['identity'];
      this.biswapServ.getPair(identity).subscribe(
        (pair: any) => {
          this.pair = pair;
          this.pairName = pair.token0Name + '/' + pair.token1Name;
        }
      );

      this.biswapServ.getTransactionsByPair(identity).subscribe(
        (transactions: any) => {
          this.transactions = transactions;
        }
      );
    });
    
  }

}


