import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StakingComponent } from './staking.component';
import { StakingRoutingModule } from './staking-routing.module';
import { MaterialModule } from '../material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddStakingComponent } from './add-staking/add-staking.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    StakingComponent,
    AddStakingComponent
  ],
  imports: [
    CommonModule,
    StakingRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    MatSnackBarModule,
    FormsModule
  ]
})
export class StakingModule { }
