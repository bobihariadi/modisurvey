import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeriksarutePageRoutingModule } from './periksarute-routing.module';

import { PeriksarutePage } from './periksarute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeriksarutePageRoutingModule
  ],
  declarations: [PeriksarutePage]
})
export class PeriksarutePageModule {}
