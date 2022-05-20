import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLiquidityComponent } from './addLiquidity/addLiquidity.component';
import { PoolComponent } from './pool.component';
import { RemoveLiquidityComponent } from './removeLiquidity/removeLiquidity.component';

const routes: Routes = [
  {
    path: '',
    component: PoolComponent
  },
  {
    path: 'add',
    component: AddLiquidityComponent
  },
  {
    path: 'remove',
    component: RemoveLiquidityComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoolRoutingModule { }