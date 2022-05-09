import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WalletComponent } from './wallet/wallet.component';
import { GenerateUrlPipe } from './pipes/generate.url.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TokenListComponent } from './tokenList/tokenList.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    AppRoutingModule,
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    WalletComponent,
    GenerateUrlPipe,
    TokenListComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    WalletComponent,
    GenerateUrlPipe,
    TokenListComponent
  ]
})
export class SharedModule {}
