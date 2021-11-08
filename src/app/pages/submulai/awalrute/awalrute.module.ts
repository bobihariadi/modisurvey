import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AwalrutePageRoutingModule } from './awalrute-routing.module';

import { AwalrutePage } from './awalrute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AwalrutePageRoutingModule
  ],
  declarations: [AwalrutePage]
})
export class AwalrutePageModule {}
