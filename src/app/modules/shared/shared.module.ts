import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { MatSelectModule } from '@angular/material/select';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { AlertComponent } from './alert/alert.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    FlexLayoutModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    WalletComponent,
    GenerateUrlPipe,
    TokenListComponent,
    SidenavListComponent,
    AlertComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    WalletComponent,
    GenerateUrlPipe,
    TokenListComponent,
    SidenavListComponent,
    AlertComponent
  ]
})
export class SharedModule { }
