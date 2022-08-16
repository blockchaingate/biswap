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
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    WalletComponent,
    GenerateUrlPipe,
    TokenListComponent,
    SidenavListComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    WalletComponent,
    GenerateUrlPipe,
    TokenListComponent,
    SidenavListComponent,
  ]
})
export class SharedModule {}
