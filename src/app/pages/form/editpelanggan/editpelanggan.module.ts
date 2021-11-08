import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditpelangganPageRoutingModule } from './editpelanggan-routing.module';

import { EditpelangganPage } from './editpelanggan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditpelangganPageRoutingModule
  ],
  declarations: [EditpelangganPage]
})
export class EditpelangganPageModule {}
