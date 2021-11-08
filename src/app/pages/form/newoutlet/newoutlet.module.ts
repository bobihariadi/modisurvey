import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewoutletPageRoutingModule } from './newoutlet-routing.module';

import { NewoutletPage } from './newoutlet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewoutletPageRoutingModule
  ],
  declarations: [NewoutletPage]
})
export class NewoutletPageModule {}
