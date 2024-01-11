import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwapComponent } from './swap.component';

const routes: Routes = [
  {
    path: '',
    component: SwapComponent
  },
  {
    path: 'token/:tokenid',
    component: SwapComponent
  },
  {
    path: 'pair/:tokenid',
    component: SwapComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwapRoutingModule { }
