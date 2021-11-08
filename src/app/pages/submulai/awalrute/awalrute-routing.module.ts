import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AwalrutePage } from './awalrute.page';

const routes: Routes = [
  {
    path: '',
    component: AwalrutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AwalrutePageRoutingModule {}
