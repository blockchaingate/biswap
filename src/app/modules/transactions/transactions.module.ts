import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MaterialModule } from '../material-module';

@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    TranslateModule,
    MaterialModule
  ]
})
export class TransactionsModule { }
