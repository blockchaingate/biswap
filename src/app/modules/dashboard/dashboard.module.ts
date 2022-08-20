import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './deshboard.routing.module';
import { MaterialModule } from '../material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    NgxUiLoaderModule.forRoot({})
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
