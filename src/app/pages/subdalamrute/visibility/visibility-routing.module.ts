import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisibilityPage } from './visibility.page';

const routes: Routes = [
  {
    path: '',
    component: VisibilityPage
  },
  {
    path: 'ambilgambar',
    loadChildren: () => import('./ambilgambar/ambilgambar.module').then( m => m.AmbilgambarPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisibilityPageRoutingModule {}
