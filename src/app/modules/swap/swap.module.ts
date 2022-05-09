import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwapComponent } from './swap.component';
import { SwapRoutingModule } from './swap.routing.module';
import { MaterialModule } from '../material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { KanbanService } from 'src/app/services/kanban.service';

@NgModule({
  imports: [
    CommonModule,
    SwapRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
  ],
  providers:[KanbanService],
  declarations: [SwapComponent]
})
export class SwapModule { }
