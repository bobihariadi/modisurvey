import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartvisitPage } from './startvisit.page';

const routes: Routes = [
  {
    path: '',
    component: StartvisitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartvisitPageRoutingModule {}
