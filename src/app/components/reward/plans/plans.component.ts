import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-reward-plans',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  plans: any;
  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getRewardPlans().subscribe(
      (ret: any) => {
        this.plans = ret;
      }
    );
  }

}
