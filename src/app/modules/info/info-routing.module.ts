import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './info.component';
import { PoolComponent } from './pool/pool.component';
import { TokenComponent } from './token/token.component';

const routes: Routes = [
  {
    path: '',
    component: InfoComponent
  },
  {
    path: 'pool/:identity',
    component: PoolComponent
  },
  {
    path: 'token/:identity',
    component: TokenComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class InfoRoutingModule { }
