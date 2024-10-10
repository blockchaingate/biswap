import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BiswapService } from 'src/app/services/biswap.service';
import { createChart, MouseEventParams } from 'lightweight-charts';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, AfterViewInit {
  pair: any;
  transactions: any;
  title: string = '';
  value: any;
  identity: string = '';
  currentTime: any;
  items: any;
  chartObj: any;

  pageNum = 0;
  pageSize = 10;
  totalPage = 0;

  @ViewChild('chart') chart!: ElementRef;

  constructor(
    private biswapServ: BiswapService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(paramsId => {
      const identity = paramsId['identity'];
      this.identity = identity;
      this.biswapServ.getPair(identity).subscribe(
        (pair: any) => {
          this.pair = pair;
        }
      );

      this.biswapServ.getTransactionsByPair(identity, this.pageSize, this.pageNum).subscribe(
        (transactions: any) => {
          this.transactions = transactions;
        }
      );

      this.biswapServ.getCountTransactionsByPair(identity).subscribe(
        (ret: any) => {
          const totalCount = ret.totalCount;
          this.totalPage = Math.floor(totalCount / this.pageSize);
        }
      );
    });


  }

  changePageNum(pageNum: number) {
    if (pageNum < 0) {
      pageNum = 0;
    }
    if (pageNum > this.totalPage) {
      pageNum = this.totalPage;
    }
    this.pageNum = pageNum;
    this.biswapServ.getTransactionsByPair(this.identity, this.pageSize, this.pageNum).subscribe((transactions: any) => {
      this.transactions = transactions;
    });
  }

  ngAfterViewInit() {

    this.biswapServ.getPairDayDatas(this.identity).subscribe(
      (items: any) => {

        this.chartObj = createChart(this.chart["nativeElement"], { width: 400, height: 300 });
        this.items = items;
        this.changeTab('Volume');
      });
  }
  changeTab(tabName: string) {
    this.title = tabName;

    switch (tabName) {
      case 'Volume':
        this.createVolumeChart();
        break;
      case 'TVL':
        this.createTVLChart();
        break;
      case 'Fees':
        this.createFeesChart();
        break;
    }
  }

  createVolumeChart() {

    //const lineSeries = chart.addLineSeries();
    const histogramSeries = this.chartObj.addHistogramSeries({ color: '#26a69a' });

    const histogramDatas = this.items.map((item: any) => {
      const date = new Date(item.date * 1000);
      const timeString = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
      const lineData = {
        time: timeString,
        value: item.dailyVolumeUSD
      };
      return lineData;
    });
    const currentItem = histogramDatas[histogramDatas.length - 1];
    this.value = currentItem.value;
    this.currentTime = currentItem.time;

    histogramSeries.setData(histogramDatas);


    var that = this;
    this.chartObj.subscribeCrosshairMove(function (param: MouseEventParams) {

      const time: any = param.time;
      const seriesPrices = param.seriesPrices;
      if (seriesPrices) {
        const seriesPrice = seriesPrices.get(histogramSeries);
        if (seriesPrice) {
          that.value = seriesPrice.valueOf();
        }

      }
      if (time) {
        const year = time.year;
        const month = time.month;
        const day = time.day;
        that.currentTime = year + '-' + month + '-' + day;
      }
    }
    );
  }

  createTVLChart() {
    //const lineSeries = chart.addLineSeries();
    const histogramSeries = this.chartObj.addLineSeries({ color: '#26a69a' });


    const histogramDatas = this.items.map((item: any) => {
      const date = new Date(item.date * 1000);
      const timeString = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
      const lineData = {
        time: timeString,
        value: item.reserveUSD
      };
      return lineData;
    });
    const currentItem = histogramDatas[histogramDatas.length - 1];
    this.value = currentItem.value;
    this.currentTime = currentItem.time;

    histogramSeries.setData(histogramDatas);


    var that = this;
    this.chartObj.subscribeCrosshairMove(function (param: MouseEventParams) {

      const time: any = param.time;
      const seriesPrices = param.seriesPrices;
      if (seriesPrices) {
        const seriesPrice = seriesPrices.get(histogramSeries);
        if (seriesPrice) {
          that.value = seriesPrice.valueOf();
        }

      }
      if (time) {
        const year = time.year;
        const month = time.month;
        const day = time.day;
        that.currentTime = year + '-' + month + '-' + day;
      }
    }
    );
  }
  createFeesChart() {
    //const lineSeries = chart.addLineSeries();
    const histogramSeries = this.chartObj.addHistogramSeries({ color: '#26a69a' });


    const histogramDatas = this.items.map((item: any) => {
      const date = new Date(item.date * 1000);
      const timeString = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
      const lineData = {
        time: timeString,
        value: new BigNumber(item.dailyVolumeUSD).multipliedBy(new BigNumber(0.003)).toNumber()
      };
      return lineData;
    });
    const currentItem = histogramDatas[histogramDatas.length - 1];
    this.value = currentItem.value;
    this.currentTime = currentItem.time;

    histogramSeries.setData(histogramDatas);


    var that = this;
    this.chartObj.subscribeCrosshairMove(function (param: MouseEventParams) {

      const time: any = param.time;
      const seriesPrices = param.seriesPrices;
      if (seriesPrices) {
        const seriesPrice = seriesPrices.get(histogramSeries);
        if (seriesPrice) {
          that.value = seriesPrice.valueOf();
        }

      }
      if (time) {
        const year = time.year;
        const month = time.month;
        const day = time.day;
        that.currentTime = year + '-' + month + '-' + day;
      }
    }
    );
  }

  showShortAmount(amount: any) {
    return new amount.toNumber().toFixed(8).toString();
  }
  
  showAmount(amount: any) {
    return new BigNumber(amount).shiftedBy(-18).toNumber()
  }
}


