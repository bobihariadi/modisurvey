import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditpelangganPage } from './editpelanggan.page';

const routes: Routes = [
  {
    path: '',
    component: EditpelangganPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditpelangganPageRoutingModule {}
