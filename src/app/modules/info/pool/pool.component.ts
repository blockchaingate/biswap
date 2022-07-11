import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  pair: any;
  transactions: any;
  title: string;
  value: number;
  currentTime: any;
  @ViewChild('chart') chart: ElementRef;

  constructor(private biswapServ: BiswapService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(paramsId => {
      const identity = paramsId['identity'];
      this.biswapServ.getPair(identity).subscribe(
        (pair: any) => {
          this.pair = pair;
        }
      );

      this.biswapServ.getTransactionsByPair(identity).subscribe(
        (transactions: any) => {
          this.transactions = transactions;
        }
      );
    });

    this.changeTab('Volume');
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


