import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewoutletPage } from './newoutlet.page';

const routes: Routes = [
  {
    path: '',
    component: NewoutletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewoutletPageRoutingModule {}
