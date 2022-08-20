import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardComponent } from './reward.component';
import { RewardRoutingModule } from './reward-routing.module';
import { PlansComponent } from './plans/plans.component';
import { DetailsComponent } from './details/details.component';
import {MatButtonModule} from '@angular/material/button';
import { RedeemsComponent } from './redeems/redeems.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RewardComponent,
    PlansComponent,
    DetailsComponent,
    RedeemsComponent
  ],
  imports: [
    CommonModule,
    RewardRoutingModule,
    MatButtonModule,
    TranslateModule
  ]
})
export class RewardModule { }
