import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  account: string = '';
  transactions: any;
  pageSizeTransaction = 10;
  pageNumTransaction = 0;
  totalPage: number = 0;

  constructor(
    private biswapServ: BiswapService,
    private walletService: WalletService) { }

  connectWallet() {
    this.walletService.connectWalletNew();
  }

  ngOnInit(): void {
    this.account = this.walletService.account;
    if(!this.account){
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
          this.getTransactions();
        }
      );
    } else {
      this.getTransactions();
    }
  }

  getTransactions() {
    this.biswapServ.getTransactionsByAccount(this.account, this.pageSizeTransaction, this.pageNumTransaction).subscribe((transactions: any) => {
      this.transactions = transactions;
    });
  }

  changePageNumTransaction(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    if(pageNum > this.totalPage) {
      pageNum = this.totalPage;
    }
    this.pageNumTransaction = pageNum;
    this.biswapServ.getTransactions(this.pageSizeTransaction, this.pageNumTransaction).subscribe((transactions: any) => {
      this.transactions = transactions;
    });
  }
}
