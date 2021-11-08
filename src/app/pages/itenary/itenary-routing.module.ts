import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItenaryPage } from './itenary.page';

const routes: Routes = [
  {
    path: '',
    component: ItenaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItenaryPageRoutingModule {}
