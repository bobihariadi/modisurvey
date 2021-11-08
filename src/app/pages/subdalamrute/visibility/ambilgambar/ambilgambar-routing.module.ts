import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmbilgambarPage } from './ambilgambar.page';

const routes: Routes = [
  {
    path: '',
    component: AmbilgambarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmbilgambarPageRoutingModule {}
