import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLiquidityComponent } from './addLiquidity/addLiquidity.component';
import { PoolComponent } from './pool.component';

const routes: Routes = [
  {
    path: '',
    component: PoolComponent
  },
  {
    path: 'add',
    component: AddLiquidityComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoolRoutingModule { }