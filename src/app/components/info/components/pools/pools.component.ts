import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-pools',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  @Input() pairs: any;
  constructor() { }

  ngOnInit(): void {
  }

  getARP(pair: any) {
    if (!pair.summary || !pair.summary.reserveUSD) {
      return 0;
    }
    return Number((pair.summary.dailyVolumeUSD * 0.003 / pair.summary.reserveUSD * 365 * 100).toFixed(2));
  }

  showAmount(amount: any) {
    return new BigNumber(amount).shiftedBy(-18).toNumber()
  }

  showShortAmount(amount: any) {
    return parseFloat(amount + '').toFixed(8).replace(/\.0+$/, '');
  }
}
