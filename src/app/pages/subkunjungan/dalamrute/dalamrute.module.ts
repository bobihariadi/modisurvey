import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DalamrutePageRoutingModule } from './dalamrute-routing.module';

import { DalamrutePage } from './dalamrute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DalamrutePageRoutingModule
  ],
  declarations: [DalamrutePage]
})
export class DalamrutePageModule {}
