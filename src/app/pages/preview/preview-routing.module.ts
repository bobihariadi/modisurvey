import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewPage } from './preview.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewPage
  },
  {
    path: 'availability',
    loadChildren: () => import('./availability/availability.module').then( m => m.AvailabilityPageModule)
  },
  {
    path: 'visibility',
    loadChildren: () => import('./visibility/visibility.module').then( m => m.VisibilityPageModule)
  },
  {
    path: 'survey',
    loadChildren: () => import('./survey/survey.module').then( m => m.SurveyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewPageRoutingModule {}
