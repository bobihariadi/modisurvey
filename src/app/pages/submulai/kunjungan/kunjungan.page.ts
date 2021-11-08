import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@Component({
  selector: 'app-kunjungan',
  templateUrl: './kunjungan.page.html',
  styleUrls: ['./kunjungan.page.scss'],
})
export class KunjunganPage implements OnInit {

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  async refreshData(event) {
    event.target.complete();
  }

  async goTo(param) {
    await this.router.navigateByUrl(param);
  }

  async btnPopover(ev: any) {
    let popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();
  }

}
