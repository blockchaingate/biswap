import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-reward-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  rewards: any;
  pageNum = 0;
  pageSize = 10;
  totalPage = 0;
  account: string = '';

  constructor(
    private walletService: WalletService,
    private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getRewards(this.pageSize, this.pageNum).subscribe(
      (ret: any) => {
        this.rewards = ret;
      }
    );

    this.biswapServ.getCountRewards().subscribe(
      (ret: any) => {
        const totalCount = ret.totalCount;
        this.totalPage = Math.floor(totalCount / this.pageSize);
      }
    );

    this.account = this.walletService.account;
    if(!this.account){
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
        }
      );
    }
  }

  redeem(address: string, tokenName: string) {
    
    this.biswapServ.redeem(address, tokenName).subscribe(
      (ret: any) => {
        console.log('ret===', ret);
      }
    );
    
  }

  changePageNum(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    if(pageNum > this.totalPage) {
      pageNum = this.totalPage;
    }
    this.pageNum = pageNum;
    this.biswapServ.getRewards(this.pageSize, this.pageNum).subscribe(
      (ret: any) => {
        this.rewards = ret;
      }
    );
  }

}
