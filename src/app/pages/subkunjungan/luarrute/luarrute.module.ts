import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LuarrutePageRoutingModule } from './luarrute-routing.module';

import { LuarrutePage } from './luarrute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LuarrutePageRoutingModule
  ],
  declarations: [LuarrutePage]
})
export class LuarrutePageModule {}
