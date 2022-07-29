import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-airdrop-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  airdrops: any;
  constructor(
    private utilServ: UtilsService,
    private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getAirdrops().subscribe(
      (ret: any) => {
        this.airdrops = ret;
      }
    );
  }

}
