import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BiswapService } from 'src/app/services/biswap.service';
import { TokensComponent } from '../components/tokens/tokens.component';

@Component({
  selector: 'app-all-tokens',
  standalone: true,
  imports: [TranslateModule, TokensComponent],
  templateUrl: './all-tokens.component.html',
  styleUrls: ['./all-tokens.component.scss']
})
export class AllTokensComponent implements OnInit {
  tokens: any;
  pageNum = 0;
  pageSize = 10;
  totalPage = 0;

  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getTokens(this.pageSize, this.pageNum).subscribe((tokens: any) => {
      this.tokens = tokens;
    });

    this.biswapServ.getCountTokens().subscribe(
      (ret: any) => {
        const totalCount = ret.totalCount;
        this.totalPage = Math.floor(totalCount / this.pageSize);
      }
    );
  }

  changePageNum(pageNum: number) {
    if (pageNum < 0) {
      pageNum = 0;
    }
    if (pageNum > this.totalPage) {
      pageNum = this.totalPage;
    }
    this.pageNum = pageNum;
    this.biswapServ.getTokens(this.pageSize, this.pageNum).subscribe((tokens: any) => {
      this.tokens = tokens;
    });
  }

}
