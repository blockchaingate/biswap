import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StakingComponent } from './staking.component';
import { AddStakingComponent } from './add-staking/add-staking.component';
import { WithdrawStakingComponent } from './withdraw-staking/withdraw-staking.component';
import { StakingHistoryComponent } from './staking-history/staking-history.component';

const routes: Routes = [
  {
    path: '',
    component: StakingComponent
  },
  {
    path: 'add',
    component: AddStakingComponent
  },
  {
    path: 'withdraw',
    component: WithdrawStakingComponent
  },
  {
    path: 'history',
    component: StakingHistoryComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StakingRoutingModule { }
