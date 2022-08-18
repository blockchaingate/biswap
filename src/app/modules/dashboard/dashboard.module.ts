import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './deshboard.routing.module';
import { MaterialModule } from '../material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { VersionComponent } from './version/version.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    NgxUiLoaderModule.forRoot({})
  ],
  declarations: [DashboardComponent, VersionComponent]
})
export class DashboardModule { }
