import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadComponent } from './download.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DownloadRoutingModule } from './download.routing.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    DownloadRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule,
    NgxUiLoaderModule.forRoot({})
  ],
  declarations: [DownloadComponent]
})
export class DownloadModule { }
