import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { createChart, MouseEventParams } from 'lightweight-charts';

@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss']
})
export class VolumeComponent implements OnInit {
  @Input() items: any;
  currentVolume: number | Object;
  currentTime: string;
  @ViewChild('volume') volume: ElementRef;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any){
    const items = changes && changes.items && changes.items.currentValue;
    if(items && items.length > 0) {
      this.createChart(items);
    }
  }

  createChart(items: any) {
    console.log('items on volume=', items);
    const chart = createChart(this.renderer.selectRootElement(this.volume["nativeElement"]), { width: 400, height: 300 });
    //const lineSeries = chart.addLineSeries();
    const histogramSeries = chart.addHistogramSeries({ color: '#26a69a' });


    const histogramDatas = items.map((item: any) => {
      const date = new Date(item.date * 1000);
      const timeString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
      const lineData = {
        time: timeString,
        value: item.dailyVolumeUSD
      };
      return lineData;
    });
    const currentItem = histogramDatas[histogramDatas.length - 1];
    this.currentVolume = currentItem.value;
    this.currentTime = currentItem.time;

    histogramSeries.setData(histogramDatas);


    var that = this;
    chart.subscribeCrosshairMove(function(param: MouseEventParams) {

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

  ngAfterViewInit() { 

  }

}
