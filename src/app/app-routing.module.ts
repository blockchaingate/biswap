import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(x => x.DashboardModule)
  },
  {
    path: 'swap',
    loadChildren: () => import('./modules/swap/swap.module').then(x => x.SwapModule)
  },
  {
    path: 'pool',
    loadChildren: () => import('./modules/pool/pool.module').then(x => x.PoolModule)
  },
  {
    path: 'vote',
    loadChildren: () => import('./modules/vote/vote.module').then(x => x.VoteModule)
  },
  {
    path: 'charts',
    loadChildren: () => import('./modules/charts/charts.module').then(x => x.ChartsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
