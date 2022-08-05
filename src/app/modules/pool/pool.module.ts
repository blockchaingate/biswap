import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoolComponent } from './pool.component';
import { MaterialModule } from '../material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { KanbanService } from 'src/app/services/kanban.service';
import { FormsModule } from '@angular/forms';
import { PoolRoutingModule } from './pool.routing.module';
import { Web3Service } from 'src/app/services/web3.service';
import { AddLiquidityComponent } from './addLiquidity/addLiquidity.component';
import { RemoveLiquidityComponent } from './removeLiquidity/removeLiquidity.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { HextoDecimalPipe } from './hextodecimal.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    PoolRoutingModule,
    NgxUiLoaderModule.forRoot({})
  ],
  providers:[KanbanService, Web3Service],
  declarations: [
    PoolComponent, 
    AddLiquidityComponent, 
    RemoveLiquidityComponent, 
    HextoDecimalPipe
  ]
})
export class PoolModule { }
