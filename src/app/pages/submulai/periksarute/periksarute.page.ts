import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@Component({
  selector: 'app-periksarute',
  templateUrl: './periksarute.page.html',
  styleUrls: ['./periksarute.page.scss'],
})
export class PeriksarutePage implements OnInit {

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  refreshData(event){
    event.target.complete();
  }

  goTo(param) {
    this.router.navigateByUrl(param);
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
