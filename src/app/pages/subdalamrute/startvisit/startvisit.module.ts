import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartvisitPageRoutingModule } from './startvisit-routing.module';

import { StartvisitPage } from './startvisit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartvisitPageRoutingModule
  ],
  declarations: [StartvisitPage]
})
export class StartvisitPageModule {}
