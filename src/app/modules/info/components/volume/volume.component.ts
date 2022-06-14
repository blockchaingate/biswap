import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { createChart, MouseEventParams } from 'lightweight-charts';

@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss']
})
export class VolumeComponent implements OnInit {
  currentVolume: number | Object;
  currentTime: string;
  @ViewChild('volume') volume: ElementRef;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() { 
    const chart = createChart(this.renderer.selectRootElement(this.volume["nativeElement"]), { width: 400, height: 300 });
    //const lineSeries = chart.addLineSeries();
    const histogramSeries = chart.addHistogramSeries({ color: '#26a69a' });
    histogramSeries.setData([
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
        const seriesPrice = seriesPrices.get(histogramSeries);
        if(seriesPrice) {
          that.currentVolume = seriesPrice.valueOf();
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
