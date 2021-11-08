import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyoutletPageRoutingModule } from './myoutlet-routing.module';

import { MyoutletPage } from './myoutlet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyoutletPageRoutingModule
  ],
  declarations: [MyoutletPage]
})
export class MyoutletPageModule {}
