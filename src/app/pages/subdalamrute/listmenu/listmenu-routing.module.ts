import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListmenuPage } from './listmenu.page';

const routes: Routes = [
  {
    path: '',
    component: ListmenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListmenuPageRoutingModule {}
