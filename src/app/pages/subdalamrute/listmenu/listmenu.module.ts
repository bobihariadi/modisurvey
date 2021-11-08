import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListmenuPageRoutingModule } from './listmenu-routing.module';

import { ListmenuPage } from './listmenu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListmenuPageRoutingModule
  ],
  declarations: [ListmenuPage]
})
export class ListmenuPageModule {}
