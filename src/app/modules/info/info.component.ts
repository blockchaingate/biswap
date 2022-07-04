import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  tabName = 'overview';
  items: any;
  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getDayDatas(100, 0).subscribe((items: any) => {
      this.items = items.reverse();
    })
  }

}
