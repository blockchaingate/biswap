import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { Router } from '@angular/router';
import { StakeService } from 'src/app/services/stake.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.scss']
})
export class StakingComponent implements OnInit {
  account: string;
  reward: number;
  amount: number;
  walletSession: any;
  totalStaking: number;

  intervalId: any;

  constructor(
    private router: Router,
    private walletService: WalletService,
    private stakeServ: StakeService
  ) { }

  ngOnInit(): void {
    this.account = this.walletService.account;
    if(this.account) {
      this.getSummary();
      this.intervalId = setInterval(() => {
        this.getSummary();
      }, 5000);

    } else {
      this.walletService.accountSubject.subscribe(
        account => {
          this.account = account;
          this.getSummary();
          this.intervalId = setInterval(() => {
            this.getSummary();
          }, 5000);
  
        }
      );
    }

  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  getSummary() {
    this.stakeServ.getSummary(this.account).subscribe(
      (summary: any) => {
        this.reward = summary.reward;
        this.amount = summary.amount;
      }
    );
  }

  connectWallet() {
    this.walletService.connectWalletNew();
  }

  addStaking() {
    this.router.navigate(['/staking/add']);
  }

  withdrawStaking() {
    this.router.navigate(['/staking/withdraw']);
  }

  showStakings() {
    this.router.navigate(['/staking/history']);
  }
}
