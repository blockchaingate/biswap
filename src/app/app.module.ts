import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './modules/material-module';
import { SharedModule } from './modules/shared/shared.module';
import { KanbanService } from './services/kanban.service';
import { HttpClientModule } from '@angular/common/http';
import { Web3Service } from './services/web3.service';
import { StakeService } from './services/stake.service';
import { BiswapService } from './services/biswap.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [KanbanService, Web3Service, StakeService, BiswapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
