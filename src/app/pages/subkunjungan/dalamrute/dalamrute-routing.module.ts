import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DalamrutePage } from './dalamrute.page';

const routes: Routes = [
  {
    path: '',
    component: DalamrutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DalamrutePageRoutingModule {}
