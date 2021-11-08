import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeritaharianPage } from './beritaharian.page';

const routes: Routes = [
  {
    path: '',
    component: BeritaharianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeritaharianPageRoutingModule {}
