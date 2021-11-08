import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendinguploadPageRoutingModule } from './pendingupload-routing.module';

import { PendinguploadPage } from './pendingupload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendinguploadPageRoutingModule
  ],
  declarations: [PendinguploadPage]
})
export class PendinguploadPageModule {}
