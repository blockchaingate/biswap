import { Component, OnInit, ElementRef, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BiswapService } from 'src/app/services/biswap.service';
import { createChart, MouseEventParams } from 'lightweight-charts';
import BigNumber from 'bignumber.js';
import { TranslateModule } from '@ngx-translate/core';
import { SalesComponent } from '../components/sales/sales.component';
import { PoolsComponent } from '../components/pools/pools.component';
import { TransactionsComponent } from '../components/transactions/transactions.component';

@Component({
  selector: 'app-token',
  standalone: true,
  imports: [RouterLink, TranslateModule, SalesComponent, PoolsComponent, TransactionsComponent],
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit, AfterViewInit {
  token: any;
  identity: string = '';
  title: string = '';
  value: any;
  currentTime: any;
  chartObj: any;
  pairs: any;
  transactions: any;
  items: any;

  pageNum = 0;
  pageSize = 10;
  totalPage = 0;

  formattedDates = [];

  dailyLiquidity!: Number[];
  dailyVolume!: Number[];
  dailyTLV!: Number[];
  chartItems!: Number[];
  isItemLoaded = false;

  @ViewChild('chart') chart!: ElementRef;
  constructor(private biswapServ: BiswapService, private activatedRoute: ActivatedRoute) { }

  changePageNum(pageNum: number) {
    if (pageNum < 0) {
      pageNum = 0;
    }
    if (pageNum > this.totalPage) {
      pageNum = this.totalPage;
    }
    this.pageNum = pageNum;
    this.biswapServ.getTransactionsByToken(this.identity, this.pageSize, this.pageNum).subscribe((transactions: any) => {
      this.transactions = transactions;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(paramsId => {
      const identity = paramsId['identity'];
      this.identity = identity;
      this.biswapServ.getToken(identity).subscribe(
        (token: any) => {
          this.token = token;
        }
      );

      this.biswapServ.getPairsByToken(identity).subscribe(
        (pairs: any) => {
          this.pairs = pairs;
        }
      );

      this.biswapServ.getTransactionsByToken(identity, this.pageSize, this.pageNum).subscribe(
        (transactions: any) => {
          this.transactions = transactions;
        }
      );

      this.biswapServ.getCountTransactionsByToken(identity).subscribe(
        (ret: any) => {
          const totalCount = ret.totalCount;
          this.totalPage = Math.floor(totalCount / this.pageSize);
        }
      );

    });
  }

  ngAfterViewInit() {

    this.biswapServ.getTokenDayDatas(this.identity).subscribe(
      (items: any) => {
        console.log("Token info: ", items);
        this.items = items;


        // this.chartObj = createChart(this.chart["nativeElement"], { width: 400, height: 300 });
        this.formattedDates = this.items.map((obj: any) => {
          return this.converTime(obj.date);
        });

        this.dailyVolume = this.items.map((obj: any) => obj.dailyVolumeUSD);
        this.dailyLiquidity = this.items.map((obj: any) => obj.totalLiquidityFAB);
        this.dailyTLV = this.items.map((obj: any) => obj.reserveUSD);

        console.log("Chart dailyVolume: ", this.dailyVolume);
        console.log("Chart dailyLiquidity: ", this.dailyLiquidity);
        console.log("Chart dailyTLV: ", this.dailyTLV);

        this.chartItems = this.dailyVolume;



        this.isItemLoaded = true;

        // this.changeTab('Volume');
      });
  }

  UpdateChart() {

  }


  changeTab(tabName: string) {
    this.title = tabName;
    switch (tabName) {
      case 'Volume':
        this.isItemLoaded = false;
        // this.createVolumeChart();
        this.chartItems = this.dailyVolume;
        break;
      case 'TVL':
        // this.createTVLChart();
        this.chartItems = this.dailyTLV;
        break;
      case 'Fees':
        // this.createFeesChart();
        this.chartItems = this.dailyVolume.map((item: any) => {
          return new BigNumber(item).multipliedBy(new BigNumber(0.003)).toNumber();
        });
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
    this.chartObj.subscribeCrosshairMove(function (param: any) {

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
    this.chartObj.subscribeCrosshairMove(function (param: any) {

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
    this.chartObj.subscribeCrosshairMove(function (param: any) {

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

  converTime(time: number) {
    const date = new Date(time * 1000); // Convert Unix timestamp to JavaScript date
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
