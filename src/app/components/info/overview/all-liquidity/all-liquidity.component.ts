import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LiquidityComponent } from '../../components/liquidity/liquidity.component';

@Component({
  selector: 'app-all-liquidity',
  standalone: true,
  imports: [TranslateModule, LiquidityComponent],
  templateUrl: './all-liquidity.component.html',
  styleUrls: ['./all-liquidity.component.scss']
})
export class AllLiquidityComponent implements OnInit {
  @Input() items: any;
  constructor() { }

  ngOnInit(): void {
    console.log('this.items24555555=', this.items);
  }

}
