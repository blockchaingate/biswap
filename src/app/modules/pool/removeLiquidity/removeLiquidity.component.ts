import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Router } from '@angular/router';
import { Coin } from 'src/app/models/coin';

@Component({
  selector: 'app-removeLiquidity',
  templateUrl: './removeLiquidity.component.html',
  styleUrls: ['./removeLiquidity.component.scss']
})
export class RemoveLiquidityComponent implements OnInit {

   firstToken: Coin = new Coin();
   secondToken: Coin = new Coin();
   yourPoolShare: number;

   firstTokeninPair:number;
   secondTokeninPair:number;
   totalPoolToken:number;

   selectedFirstTokenAmount: number;
   selectedSecondTokenAmount: number;

  percentage= 0;

  constructor(
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation!.extras.state as {firstToken: Coin, secondToken: Coin, yourPoolShare: number, firstTokeninPair:number, secondTokeninPair:number , totalPoolToken:number};
    this.firstToken = state.firstToken;
    this.secondToken = state.secondToken;
    this.yourPoolShare = state.yourPoolShare;
    this.firstTokeninPair = state.firstTokeninPair;
    this.secondTokeninPair = state.secondTokeninPair;
    this.totalPoolToken = state.totalPoolToken;
   }

  ngOnInit() {

    // this.firstToken.tickerName = "FAB"
    // this.secondToken.tickerName = "EXG"

    // this.firstToken.decimal= 324234;
    // this.secondToken.decimal =12131;

    // this.yourPoolShare = 344;
    // this.firstTokeninPair = 3424;
    // this.secondTokeninPair = 0.0034242;
    // this.totalPoolToken = 5.432

    // this.selectedFirstTokenAmount = 0;
    // this.selectedSecondTokenAmount = 0;

  }

  goBack(){
    this.router.navigate(['/pool']);
  }


  onInputChange(event: MatSliderChange) {
    this.percentage = event.value!;
    this.selectedFirstTokenAmount = (this.percentage * this.firstTokeninPair) / 100;
    this.selectedSecondTokenAmount = (this.percentage* this.secondTokeninPair) / 100;
  }

  removeLiquidity() {

  }

 
   
  

}
