import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coin } from 'src/app/models/coin';

@Component({
  selector: 'app-removeLiquidity',
  templateUrl: './removeLiquidity.component.html',
  styleUrls: ['./removeLiquidity.component.scss']
})
export class RemoveLiquidityComponent implements OnInit {

  firstToken: Coin;
  secondToken: Coin;

  firstTokenName: string;
  secondTokenName: string;

  percentage= 0;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.firstTokenName = "FAB";
    this.secondTokenName = "EXG";
  }

  goBack(){
    this.router.navigate(['/pool']);
  }

  formatLabel(value: number) {
    this.percentage = value;
    return value;
  }

  removeLiquidity() {
    console.log("remove Liquidity")
  }

}
