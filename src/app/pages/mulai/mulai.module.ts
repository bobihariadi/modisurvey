import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MulaiPageRoutingModule } from './mulai-routing.module';

import { MulaiPage } from './mulai.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MulaiPageRoutingModule
  ],
  declarations: [MulaiPage]
})
export class MulaiPageModule {}
