import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoRoutingModule } from './info-routing.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { OverviewComponent } from './overview/overview.component';
import { AllPoolsComponent } from './all-pools/all-pools.component';
import { AllTokensComponent } from './all-tokens/all-tokens.component';
import { AllLiquidityComponent } from './overview/all-liquidity/all-liquidity.component';
import { AllVolumeComponent } from './overview/all-volume/all-volume.component';
import { TopTokensComponent } from './overview/top-tokens/top-tokens.component';
import { TopPoolsComponent } from './overview/top-pools/top-pools.component';
import { AllTransactionsComponent } from './overview/all-transactions/all-transactions.component';
import { LiquidityComponent } from './components/liquidity/liquidity.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { VolumeComponent } from './components/volume/volume.component';
import { PoolsComponent } from './components/pools/pools.component';
import { TokensComponent } from './components/tokens/tokens.component';
import { InfoComponent } from './info.component';
@NgModule({
  declarations: [
    OverviewComponent,
    AllPoolsComponent,
    AllTokensComponent,
    AllLiquidityComponent,
    AllVolumeComponent,
    TopTokensComponent,
    TopPoolsComponent,
    AllTransactionsComponent,
    LiquidityComponent,
    TransactionsComponent,
    VolumeComponent,
    PoolsComponent,
    TokensComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    InfoRoutingModule,
    MatButtonToggleModule,
    FormsModule
  ]
})
export class InfoModule { }
