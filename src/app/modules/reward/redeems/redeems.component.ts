import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reward-redeems',
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
