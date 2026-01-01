import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, TranslateModule, NgxUiLoaderModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.ngxService.start();

    // this.ngxService.startLoader("loader-01");

    // setTimeout(() => {
    //   this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
    // }, 5000);


    // this.ngxService.startBackground("do-background-things");
  }




}
