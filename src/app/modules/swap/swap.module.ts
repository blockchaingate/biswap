import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwapComponent } from './swap.component';
import { SwapRoutingModule } from './swap.routing.module';
import { MaterialModule } from '../material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { KanbanService } from 'src/app/services/kanban.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SettingsComponent } from '../settings/settings.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    SwapRoutingModule,
    MaterialModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule,
    TranslateModule,
    MatSnackBarModule,
    FormsModule,
    NgxUiLoaderModule.forRoot({}),
  ],
  bootstrap: [SettingsComponent],
  providers: [KanbanService],
  declarations: [SwapComponent, SettingsComponent]
})
export class SwapModule { }
