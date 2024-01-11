import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-liquidity',
  templateUrl: './all-liquidity.component.html',
  styleUrls: ['./all-liquidity.component.scss']
})
export class AllLiquidityComponent implements OnInit {
  @Input() items: any;
  constructor() { }

  ngOnInit(): void {
    console.log('this.items245=', this.items);
  }

}
