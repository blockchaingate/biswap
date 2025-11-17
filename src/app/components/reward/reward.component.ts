import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PlansComponent } from './plans/plans.component';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-reward',
  standalone: true,
  imports: [TranslateModule, PlansComponent, DetailsComponent],
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.scss']
})
export class RewardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
