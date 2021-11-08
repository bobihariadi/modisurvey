import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListdetailPage } from './listdetail.page';

const routes: Routes = [
  {
    path: '',
    component: ListdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListdetailPageRoutingModule {}
