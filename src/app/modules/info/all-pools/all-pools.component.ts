import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-all-pools',
  templateUrl: './all-pools.component.html',
  styleUrls: ['./all-pools.component.scss']
})
export class AllPoolsComponent implements OnInit {
  pairs: any;
  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getPairs(100, 0).subscribe((pairs: any) => {
      this.pairs = pairs;
    });
  }

}
