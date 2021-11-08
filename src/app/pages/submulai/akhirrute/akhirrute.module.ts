import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AkhirrutePageRoutingModule } from './akhirrute-routing.module';

import { AkhirrutePage } from './akhirrute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AkhirrutePageRoutingModule
  ],
  declarations: [AkhirrutePage]
})
export class AkhirrutePageModule {}
