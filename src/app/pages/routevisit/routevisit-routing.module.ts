import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutevisitPage } from './routevisit.page';

const routes: Routes = [
  {
    path: '',
    component: RoutevisitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutevisitPageRoutingModule {}
