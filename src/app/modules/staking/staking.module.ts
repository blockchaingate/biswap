import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StakingComponent } from './staking.component';
import { StakingRoutingModule } from './staking-routing.module';
import { MaterialModule } from '../material-module';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddStakingComponent } from './add-staking/add-staking.component';
import { WithdrawStakingComponent } from './withdraw-staking/withdraw-staking.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { StakingHistoryComponent } from './staking-history/staking-history.component';

@NgModule({
  declarations: [
    StakingComponent,
    AddStakingComponent,
    WithdrawStakingComponent,
    StakingHistoryComponent
  ],
  imports: [
    CommonModule,
    StakingRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule
  ]
})
export class StakingModule { }
