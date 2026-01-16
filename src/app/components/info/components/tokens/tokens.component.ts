import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {
  @Input() tokens: any;
  constructor() { }

  ngOnInit(): void {
  }

  showAmount(amount: any) {
    return new BigNumber(amount).shiftedBy(-18).toNumber()
  }

  showShortAmount(amount: any) {
    return parseFloat(amount + '').toFixed(8).replace(/\.0+$/, '');
  }
}
