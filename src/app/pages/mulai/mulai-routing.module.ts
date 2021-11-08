import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MulaiPage } from './mulai.page';

const routes: Routes = [
  {
    path: '',
    component: MulaiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MulaiPageRoutingModule {}
