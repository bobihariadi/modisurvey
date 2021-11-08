import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeritaharianPageRoutingModule } from './beritaharian-routing.module';

import { BeritaharianPage } from './beritaharian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeritaharianPageRoutingModule
  ],
  declarations: [BeritaharianPage]
})
export class BeritaharianPageModule {}
