import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-reward-redeems',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './redeems.component.html',
  styleUrls: ['./redeems.component.scss']
})
export class RedeemsComponent implements OnInit {

  redeems: any;
  constructor(
    private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getRewardRedeems().subscribe(
      (ret: any) => {
        this.redeems = ret;
      }
    );
  }

}
