import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutevisitPageRoutingModule } from './routevisit-routing.module';

import { RoutevisitPage } from './routevisit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutevisitPageRoutingModule
  ],
  declarations: [RoutevisitPage]
})
export class RoutevisitPageModule {}
