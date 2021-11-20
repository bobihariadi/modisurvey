import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-visibility',
  templateUrl: './visibility.page.html',
  styleUrls: ['./visibility.page.scss'],
})
export class VisibilityPage implements OnInit {
  idOutlet: string;
  arrList: any = [];
  fakeList: Array<any> = new Array(7);
  showList: boolean = false;
  totalRow: number;
  outlet: string;

  constructor(
    private router: Router,
    private database: DatabaseService,
    private platform: Platform,
    private storageCtrl: Storage
  ) {}

  async ngOnInit() {
    await this.storageCtrl.create();
    this.storageCtrl.get('idOutlet').then((val) => {
      this.idOutlet = val;
    });

    await this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        await this.getOutlet();
        await this.getVisibility();
      }
    });
  }

  async getOutlet() {
    let params = {
      select: 'name_outlet',
      table: 'outlet',
      where: `where id_outlet='${this.idOutlet}'`,
      order: '',
    };

    await this.database._getData(params).then(async (data) => {
      for (var i = 0; i < data.rows.length; i++) {
        this.outlet = data.rows.item(i).name_outlet;
      }
    });
  }

  async getVisibility() {
    let where = `where id_outlet='${this.idOutlet}'`;

    let params = {
      select:
        'visibility_desc, case when have_photo="Y" then "Ok" else "No" end as have_photo ',
      table: 'visibility',
      where: where,
      order: '',
    };

    await this.database._getData(params).then(async (data) => {
      this.arrList = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.arrList.push({
          desc: data.rows.item(i).visibility_desc,
          have_photo: data.rows.item(i).have_photo,
        });
        this.totalRow = i;
      }
      this.showList = true;
    });
  }

  async refreshData(event) {
    this.fakeList = new Array(this.totalRow);
    this.showList = false;
    await this.getVisibility();
    event.target.complete();
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
