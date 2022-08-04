import { Component, OnInit } from '@angular/core';
import { BiswapService } from 'src/app/services/biswap.service';

@Component({
  selector: 'app-all-pools',
  templateUrl: './all-pools.component.html',
  styleUrls: ['./all-pools.component.scss']
})
export class AllPoolsComponent implements OnInit {
  pairs: any;
  pageNum = 0;
  pageSize = 10;
  totalPage = 0;
  constructor(private biswapServ: BiswapService) { }

  ngOnInit(): void {
    this.biswapServ.getPairs(this.pageSize, this.pageNum).subscribe((pairs: any) => {
      this.pairs = pairs;
    });

    this.biswapServ.getCountPairs().subscribe(
      (ret: any) => {
        const totalCount = ret.totalCount;
        this.totalPage = Math.floor(totalCount / this.pageSize);
      }
    );
  }

  changePageNum(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    if(pageNum > this.totalPage) {
      pageNum = this.totalPage;
    }
    this.pageNum = pageNum;
    this.biswapServ.getPairs(this.pageSize, this.pageNum).subscribe((pairs: any) => {
      this.pairs = pairs;
    });
  }

}
