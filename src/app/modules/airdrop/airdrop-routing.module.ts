import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AirdropComponent } from './airdrop.component';
const routes: Routes = [
  {
    path: '',
    component: AirdropComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AirdropRoutingModule { }
