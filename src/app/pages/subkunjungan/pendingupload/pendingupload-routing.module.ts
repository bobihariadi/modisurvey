import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendinguploadPage } from './pendingupload.page';

const routes: Routes = [
  {
    path: '',
    component: PendinguploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendinguploadPageRoutingModule {}
