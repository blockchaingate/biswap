import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OverviewComponent } from './overview/overview.component';
import { AllPoolsComponent } from './all-pools/all-pools.component';
import { AllTokensComponent } from './all-tokens/all-tokens.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatButtonToggleModule, TranslateModule, OverviewComponent, AllPoolsComponent, AllTokensComponent],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  tabName = 'overview';
  selectedTab = 1;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params && params['tabName']) {
        this.tabName = params['tabName'];
      }
    });
  }

}
