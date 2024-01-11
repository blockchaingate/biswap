import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  @Input() pairs: any;
  constructor() { }

  ngOnInit(): void {
  }

  getARP(pair: any) {
    if(!pair.summary || !pair.summary.reserveUSD) {
      return 0;
    }
    return Number((pair.summary.dailyVolumeUSD * 0.003 / pair.summary.reserveUSD * 365 * 100).toFixed(2));
  }
}
