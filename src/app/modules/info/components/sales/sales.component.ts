import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  height = "400px";

  @Input() items: any;
  @Input() dates: any;
  @Input() title: string = "";
  @Input() bgColor: string = "rgba(255,0,0,0.3)";


  constructor() {
  }

  ngOnInit() {
    console.log("Chart Data Init");
    // console.log("Chart Data", this.items);

    this.lineChartData.labels = this.dates;
    this.lineChartData.datasets[0].data = this.items;
    this.lineChartData.datasets[0].backgroundColor = this.bgColor;
    this.lineChartData.datasets[0].label = this.title;

  }
  //ng on data change
  ngOnChanges() {
    console.log("Chart Data changed");
    this.lineChartData.labels = this.dates;
    this.lineChartData.datasets[0].data = this.items;
    this.lineChartData.datasets[0].backgroundColor = this.bgColor;
    this.lineChartData.datasets[0].label = this.title;

  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
    ],
    datasets: [
      {
        data: [
        ],
        label: this.title,

        fill: true,
        tension: 0.2,
        borderColor: 'black',
        backgroundColor: this.bgColor
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;


}
