import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reward-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  rewards: any;
  constructor(
    private utilServ: UtilsService,
    private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getRewards().subscribe(
      (ret: any) => {
        this.rewards = ret;
      }
    );
  }

  redeem(address: string, tokenName: string) {
    
    this.biswapServ.redeem(address, tokenName).subscribe(
      (ret: any) => {
        console.log('ret===', ret);
      }
    );
    
  }

}
