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
    path: 'info',
    loadChildren: () => import('./modules/info/info.module').then(x => x.InfoModule)
  },
  {
    path: 'reward',
    loadChildren: () => import('./modules/reward/reward.module').then(x => x.RewardModule)
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
    path: 'staking',
    loadChildren: () => import('./modules/staking/staking.module').then(x => x.StakingModule)
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
