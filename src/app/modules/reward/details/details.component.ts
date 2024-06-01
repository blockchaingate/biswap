import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';
import { WalletService } from 'src/app/services/wallet.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UtilsService } from 'src/app/services/utils.service';

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
    private _snackBar: MatSnackBar,
    private utilServ: UtilsService,
    private walletService: WalletService,
    private biswapServ: BiswapService) { }

  redeemable(item) {

    if(!item.amount) {
      return false;
    }
    if(item.tokenName == 'BCC') {
      return false;
    }
    const exgAddress = this.utilServ.fabToExgAddress(item.address);
    return exgAddress.toLowerCase() == this.account.toLowerCase();
  }
  toExgAddress(address: string) {
    return this.utilServ.fabToExgAddress(address);
  }
  
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
          if(account) {
            this.account = account;
            this.biswapServ.getRewardsWithMine(this.account, this.pageSize, this.pageNum).subscribe(
              (ret: any) => {
                this.rewards = ret;
              }
            );
          }
          
        }
      );
    } else {
      this.biswapServ.getRewardsWithMine(this.account, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.rewards = ret;
        }
      );
    }
  }

  redeem(address: string, tokenName: string) {
    
    this.biswapServ.redeem(address, tokenName).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this._snackBar.open('Your redeem request is pending');
        } else {
          this._snackBar.open('You can only redeem once per day');
        }
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
    if(this.account) {
      this.biswapServ.getRewardsWithMine(this.account, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.rewards = ret;
        }
      );
    } else {
      this.biswapServ.getRewards(this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.rewards = ret;
        }
      );
    }

  }

}
