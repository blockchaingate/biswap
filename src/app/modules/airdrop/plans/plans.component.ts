import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-airdrop-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  plans: any;
  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getAirdropPlans().subscribe(
      (ret: any) => {
        this.plans = ret;
      }
    );
  }

}
