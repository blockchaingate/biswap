import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';






@NgModule({
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    LayoutModule,
    MatSnackBarModule,
    MatListModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    LayoutModule,
    MatSnackBarModule,
    MatListModule
  ],
  providers: [],
})
export class MaterialModule { }
