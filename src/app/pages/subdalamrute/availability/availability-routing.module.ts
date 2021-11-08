import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailabilityPage } from './availability.page';

const routes: Routes = [
  {
    path: '',
    component: AvailabilityPage
  },
  {
    path: 'listdetail',
    loadChildren: () => import('./listdetail/listdetail.module').then( m => m.ListdetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailabilityPageRoutingModule {}
