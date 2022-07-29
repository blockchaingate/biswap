import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirdropComponent } from './airdrop.component';
import { AirdropRoutingModule } from './airdrop-routing.module';
import { PlansComponent } from './plans/plans.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [
    AirdropComponent,
    PlansComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    AirdropRoutingModule
  ]
})
export class AirdropModule { }
