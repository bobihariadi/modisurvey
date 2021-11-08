import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { on } from 'events';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@Component({
  selector: 'app-mulai',
  templateUrl: './mulai.page.html',
  styleUrls: ['./mulai.page.scss'],
})
export class MulaiPage implements OnInit {
  constructor(
    private popoverCtrl: PopoverController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  refreshData(event) {
    // this.page = 0;
    // this.showList = false;
    // this.searchTerm = '';
    // event.target.disabled = false;
    // this.getData(event);
    event.target.complete();
    // event.target.disabled = false;
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
