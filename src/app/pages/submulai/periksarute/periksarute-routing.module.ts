import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeriksarutePage } from './periksarute.page';

const routes: Routes = [
  {
    path: '',
    component: PeriksarutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeriksarutePageRoutingModule {}
