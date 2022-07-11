import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  token: any;
  title: string;
  value: number;
  currentTime: any;

  pairs: any;
  transactions: any;
  constructor(private biswapServ: BiswapService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(paramsId => {
      const identity = paramsId['identity'];
      this.biswapServ.getToken(identity).subscribe(
        (token: any) => {
          this.token = token;
        }
      );

      this.biswapServ.getPairsByToken(identity).subscribe(
        (pairs: any) => {
          this.pairs = pairs;
        }
      );

      this.biswapServ.getTransactionsByToken(identity).subscribe(
        (transactions: any) => {
          this.transactions = transactions;
        }
      );
    });
  }
  
  changeTab(tabName: string) {
    this.title = tabName;
    switch(tabName) {
      case 'Volume':
        this.createVolumeChart();
        break;
      case 'Volume':
        this.createLiquidityChart();
        break;
      case 'Volume':
        this.createFeesChart();
        break;        
    }
  }

  createVolumeChart() {

  }
  
  createLiquidityChart() {
    
  }
  createFeesChart() {

  }
}
