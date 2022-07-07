import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-all-tokens',
  templateUrl: './all-tokens.component.html',
  styleUrls: ['./all-tokens.component.scss']
})
export class AllTokensComponent implements OnInit {
  tokens: any;
  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getTokens(100, 0).subscribe((tokens: any) => {
      this.tokens = tokens;
    });
  }

}
