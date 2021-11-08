import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapaiPage } from './capai.page';

const routes: Routes = [
  {
    path: '',
    component: CapaiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapaiPageRoutingModule {}
