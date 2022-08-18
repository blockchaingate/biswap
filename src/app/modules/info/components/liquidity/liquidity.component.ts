import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, SimpleChanges } from '@angular/core';
import { createChart, MouseEventParams } from 'lightweight-charts';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.scss']
})
export class LiquidityComponent implements OnInit {
  @Input() items: any;
  currentLiquidity!: number | Object;
  currentTime!: string;
  @ViewChild('liquidity')
  liquidity!: ElementRef;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.currentLiquidity = 0;
    this.currentTime = '';
  }

  ngOnChanges(changes: any){
    const items = changes && changes.items && changes.items.currentValue;

    if(items && items.length > 0) {
      console.log('items for createChart==', items);
      this.createChart(items);
    }
  }

  createChart(items: any) {

    const chart = createChart(this.liquidity["nativeElement"], { width: 400, height: 300 });
    const lineSeries = chart.addLineSeries(
      { color: 'rgb(118, 69, 217)', baseLineColor: 'rgb(118, 69, 217)', priceLineColor: 'rgb(118, 69, 217)' }
    );
    const lineDatas = items.map((item: any) => {
      const date = new Date(item.date * 1000);
      const timeString = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
      console.log('timeString===', timeString);
      const lineData = {
        time: timeString,
        value: item.totalLiquidityUSD
      };
      return lineData;
    });
    console.log('lineDatas===', lineDatas);

    const currentItem = lineDatas[lineDatas.length - 1];
    console.log('currentItem=====', currentItem);
    this.currentLiquidity = currentItem.value;
    this.currentTime = currentItem.time;

    lineSeries.setData(lineDatas);

    var that = this;
    chart.subscribeCrosshairMove(function(param: MouseEventParams) {

      const time: any = param.time;
      const seriesPrices = param.seriesPrices;
      if(seriesPrices) {
        const seriesPrice = seriesPrices.get(lineSeries);
        if(seriesPrice) {
          that.currentLiquidity = seriesPrice.valueOf();
        }
        
      }
      if(time) {
        const year = time.year;
        const month = time.month;
        const day = time.day;
        that.currentTime = year + '-' + month + '-' + day;
      }
    });
  }
  ngAfterViewInit() { 

  }
}
