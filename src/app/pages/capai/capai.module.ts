import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapaiPageRoutingModule } from './capai-routing.module';

import { CapaiPage } from './capai.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapaiPageRoutingModule
  ],
  declarations: [CapaiPage]
})
export class CapaiPageModule {}
