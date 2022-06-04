import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Router } from '@angular/router';
import { StakeService } from 'src/app/services/stake.service';
import { interval, Subscription} from 'rxjs';

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


  constructor(
    private router: Router,
    private walletService: WalletService,
    private dataService: DataService,
    private stakeServ: StakeService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.walletService.accountSubject.subscribe(
      account => {
        this.account = account;
        this.getSummary();
        interval(5000).subscribe((x =>{
          this.getSummary();
        }));

      }
    );
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
    //TODO after wallet connect need to call getExistLiquidity() methid
    /*
    var result = await this.walletService.connectWallet();
    console.log('result==', result);
    if (result == null) {
      this.connectWallet();
    } else {
      this.connected();
    }
    */
    this.walletService.connectWalletNew();
  }

  addStaking() {
    this.router.navigate(['/staking/add']);
  }
}
