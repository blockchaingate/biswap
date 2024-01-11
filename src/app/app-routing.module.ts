import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewFeaturesComponent } from './components/newFeatures/newFeatures.component';
import { PrivacyComponent } from './components/privacy.component';
import { VersionComponent } from './components/version/version.component';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(x => x.HomeModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(x => x.HomeModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./modules/transactions/transactions.module').then(x => x.TransactionsModule)
  },
  {
    path: 'dashboard',
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
    loadChildren: () => import('./modules/info/info.module').then(x => x.InfoModule)
//    loadChildren: () => import('./modules/charts/charts.module').then(x => x.ChartsModule)
  },
  {
    path: 'privacy', component: PrivacyComponent
  }
  ,
  {
    path: 'version', component: VersionComponent
  },
  {
    path: 'newFeatures', component: NewFeaturesComponent
  },
  {
    path: 'download',
    loadChildren: () => import('./modules/download/download.module').then(x => x.DownloadModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
