import { Component, Inject, Input, OnInit, SimpleChange } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coin } from 'src/app/models/coin';
import { DataService } from 'src/app/services/data.service';
import { SwapComponent } from '../../swap/swap.component';

@Component({
  selector: 'app-tokenList',
  templateUrl: './tokenList.component.html',
  styleUrls: ['./tokenList.component.scss']
})
export class TokenListComponent implements OnInit {
  searchTokenLabel = '';
  tokenList: any;
  filteredTokens: Coin [] = [];

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<SwapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.tokenList = this.data.tokens;
    this.filteredTokens = this.tokenList;
    this.filteredTokens.sort(this.compare);
    this.filteredTokens.forEach((ele) => {
      ele.logoUrl = 'https://exchangily.com/assets/coins/' + ele.symbol.toLocaleLowerCase().substring(2) + '.png';
    }); 
  }

  compare(a: Coin, b: Coin ) {
    if ( a.tickerName < b.tickerName ){
      return -1;
    }
    if ( a.tickerName > b.tickerName ){
      return 1;
    }
    return 0;
  }

  selectToken(token: Coin) {
    if (this.data.isFirst) {
      this.dataService.sendFirstToken(token);
      this.dialogRef.close({
        isFirst: true
      });
    }else if(
      this.data.isSecond
    ){
      this.dataService.sendSecondToken(token);
      this.dialogRef.close({
        isSecond: true
      });
    }
  }

  searchToken(token: any) {

    this.filteredTokens = this.tokenList.filter((x: any) => x.tickerName.toLowerCase().includes(token.toLowerCase()))
    
  }

  

}
