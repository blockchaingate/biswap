import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-reward-redeems',
  standalone: true,
  imports: [TranslateModule, MatButtonModule],
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
