import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyoutletPage } from './myoutlet.page';

const routes: Routes = [
  {
    path: '',
    component: MyoutletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyoutletPageRoutingModule {}
