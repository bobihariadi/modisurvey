import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AkhirrutePage } from './akhirrute.page';

const routes: Routes = [
  {
    path: '',
    component: AkhirrutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AkhirrutePageRoutingModule {}
