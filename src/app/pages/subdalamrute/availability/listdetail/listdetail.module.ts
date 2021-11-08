import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListdetailPageRoutingModule } from './listdetail-routing.module';

import { ListdetailPage } from './listdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListdetailPageRoutingModule
  ],
  declarations: [ListdetailPage]
})
export class ListdetailPageModule {}
