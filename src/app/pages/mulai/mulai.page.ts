import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { on } from 'events';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-mulai',
  templateUrl: './mulai.page.html',
  styleUrls: ['./mulai.page.scss'],
})
export class MulaiPage implements OnInit {
  constructor(
    private popoverCtrl: PopoverController,
    private router: Router,
    private database: DatabaseService
  ) {}

  async ngOnInit() {
    await this.database.createDatabase();
  }

  async refreshData(event) {
    const d = new Date();
    let onlyDate =
      d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    let dateTime =
      onlyDate +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes() +
      ':' +
      d.getSeconds();

    console.log(onlyDate);
    // this.page = 0;
    // this.showList = false;
    // this.searchTerm = '';
    // event.target.disabled = false;
    // this.getData(event);
    event.target.complete();
    // event.target.disabled = false;
    await this.bacaItem('tx_survey');
  }

  async goTo(param) {
    await this.router.navigateByUrl(param);
  }

  async btnPopover(ev: any) {
    let popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    await popover.present();
  }

  async bacaItem(param) {
    let params = {
      select: '*',
      table: param,
      where: '',
      order: '',
    };
    this.database._getData(params).then(async (data) => {
      const arrData = [];
      for (var i = 0; i < data.rows.length; i++) {
        arrData.push(data.rows.item(i));
      }
      console.log(arrData);
    });
  }
}
