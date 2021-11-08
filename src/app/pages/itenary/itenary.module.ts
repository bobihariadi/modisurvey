import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItenaryPageRoutingModule } from './itenary-routing.module';

import { ItenaryPage } from './itenary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItenaryPageRoutingModule
  ],
  declarations: [ItenaryPage]
})
export class ItenaryPageModule {}
