import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coin } from 'src/app/models/coin';
import { DataService } from 'src/app/services/data.service';
import { SwapComponent } from '../../swap/swap.component';
import { ApiService } from 'src/app/services/api.services';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tokenList',
  standalone: true,
  imports: [MatIconModule, TranslateModule, BrowserModule, FormsModule],
  templateUrl: './tokenList.component.html',
  styleUrls: ['./tokenList.component.scss']
})
export class TokenListComponent implements OnInit {
  searchTokenLabel = '';
  tokenList: any;
  filteredTokens: Coin[] = [];

  constructor(
    private dataService: DataService,
    private apiServ: ApiService,
    public dialogRef: MatDialogRef<SwapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.tokenList = this.data.tokens;
    this.filteredTokens = this.tokenList;
    this.filteredTokens.sort(this.compare);
    this.filteredTokens.forEach((ele) => {
      if (ele && ele.symbol) {
        ele.logoUrl = 'https://exchangily.com/assets/coins/' + ele.symbol.toLocaleLowerCase() + '.png';
      } else {
        ele.logoUrl = 'https://exchangily.com/assets/coins/none.png';
      }
    });
  }

  compare(a: Coin, b: Coin) {
    if (a.tickerName < b.tickerName) {
      return -1;
    }
    if (a.tickerName > b.tickerName) {
      return 1;
    }
    return 0;
  }

  showTokenId(id: string) {
    return id.substring(0, 5) + '...' + id.substring(id.length - 3);
  }

  selectToken(token: Coin) {
    if (this.data.isFirst) {
      this.dataService.sendFirstToken(token);
      this.dialogRef.close({
        isFirst: true
      });
    } else if (
      this.data.isSecond
    ) {
      this.dataService.sendSecondToken(token);
      this.dialogRef.close({
        isSecond: true
      });
    }
  }

  searchToken(token: any) {
    this.filteredTokens = this.tokenList.filter((x: any) => x.symbol.toLowerCase().includes(token.toLowerCase()))
  }

  handleImageError(ev: any, tokenId: string) {
    ev.target.src = 'https://exchangily.com/assets/coins/none.png';
    /*
    if(tokenId.indexOf('0x') === 0) {
      tokenId = tokenId.substring(2);
    }
    
    this.apiServ.getFabTokenLogo(tokenId).subscribe({
      next: (ret: any) => {
        console.log('ret===', ret);
      },
      error: (error: any) => {
        console.log('error of handleImageError=', error);
        
      }
    }

    );
    */
    //
  }
}
