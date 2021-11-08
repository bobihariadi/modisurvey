import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmbilgambarPageRoutingModule } from './ambilgambar-routing.module';

import { AmbilgambarPage } from './ambilgambar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmbilgambarPageRoutingModule
  ],
  declarations: [AmbilgambarPage]
})
export class AmbilgambarPageModule {}
