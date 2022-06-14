import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { createChart, MouseEventParams } from 'lightweight-charts';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.scss']
})
export class LiquidityComponent implements OnInit {
  currentLiquidity: number | Object;
  currentTime: string;
  @ViewChild('liquidity') liquidity: ElementRef;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.currentLiquidity = 0;
    this.currentTime = '';
  }

  ngAfterViewInit() { 

    const chart = createChart(this.renderer.selectRootElement(this.liquidity["nativeElement"]), { width: 400, height: 300 });
    const lineSeries = chart.addLineSeries(
      { color: 'rgb(118, 69, 217)', baseLineColor: 'rgb(118, 69, 217)', priceLineColor: 'rgb(118, 69, 217)' }
    );
    lineSeries.setData([
        { time: '2019-04-11', value: 80.01 },
        { time: '2019-04-12', value: 96.63 },
        { time: '2019-04-13', value: 76.64 },
        { time: '2019-04-14', value: 81.89 },
        { time: '2019-04-15', value: 74.43 },
        { time: '2019-04-16', value: 80.01 },
        { time: '2019-04-17', value: 96.63 },
        { time: '2019-04-18', value: 76.64 },
        { time: '2019-04-19', value: 81.89 },
        { time: '2019-04-20', value: 74.43 },
    ]);

    var that = this;
    chart.subscribeCrosshairMove(function(param: MouseEventParams) {
      console.log('param====', param);
      console.log('seriesPrices==', param.seriesPrices);

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
}
