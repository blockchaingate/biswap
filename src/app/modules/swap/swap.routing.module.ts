import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwapComponent } from './swap.component';

const routes: Routes = [
  {
    path: '',
    component: SwapComponent
  },
  {
    path: 'pair/:identity',
    component: SwapComponent
  },
  {
    path: 'token/:identity',
    component: SwapComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwapRoutingModule { }
