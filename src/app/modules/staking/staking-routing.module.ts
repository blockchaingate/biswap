import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StakingComponent } from './staking.component';
import { AddStakingComponent } from './add-staking/add-staking.component';

const routes: Routes = [
  {
    path: '',
    component: StakingComponent
  },
  {
    path: 'add',
    component: AddStakingComponent
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
