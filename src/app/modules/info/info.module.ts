import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info.component';
import { InfoRoutingModule } from './info-routing.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { OverviewComponent } from './overview/overview.component';
import { PoolsComponent } from './pools/pools.component';
import { TokensComponent } from './tokens/tokens.component';
import { AllLiquidityComponent } from './overview/all-liquidity/all-liquidity.component';
import { AllVolumeComponent } from './overview/all-volume/all-volume.component';
import { TopTokensComponent } from './overview/top-tokens/top-tokens.component';
import { TopPoolsComponent } from './overview/top-pools/top-pools.component';
import { AllTransactionsComponent } from './overview/all-transactions/all-transactions.component';
import { LiquidityComponent } from './components/liquidity/liquidity.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { VolumeComponent } from './components/volume/volume.component';

@NgModule({
  declarations: [
    InfoComponent,
    OverviewComponent,
    PoolsComponent,
    TokensComponent,
    AllLiquidityComponent,
    AllVolumeComponent,
    TopTokensComponent,
    TopPoolsComponent,
    AllTransactionsComponent,
    LiquidityComponent,
    TransactionsComponent,
    VolumeComponent
  ],
  imports: [
    CommonModule,
    InfoRoutingModule,
    MatButtonToggleModule,
    FormsModule
  ]
})
export class InfoModule { }
