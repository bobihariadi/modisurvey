import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.page.html',
  styleUrls: ['./availability.page.scss'],
})
export class AvailabilityPage implements OnInit {
  idOutlet: string;
  arrList: any = [];
  arrCategory: any = [];
  fakeList: Array<any> = new Array(3);
  showList: boolean = false;
  totalRow: number = 5;
  fakeCategory: any = new Array(3);
  outlet: string;

  constructor(
    private database: DatabaseService,
    private platform: Platform,
    private storageCtrl: Storage
  ) {}

  async ngOnInit() {
    await this.storageCtrl.create();
    await this.storageCtrl.get('idOutlet').then((val) => {
      this.idOutlet = val;
    });

    await this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        await this.getOutlet();
        await this.getCategory();
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

  async getCategory() {
    let where = `where id_outlet='${this.idOutlet}'`;

    let params = {
      select: 'category_id, id_outlet, category_desc',
      table: 'tx_category',
      where: where,
      order: '',
    };

    await this.database._getData(params).then(async (data) => {
      this.arrCategory = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.arrCategory.push({
          id: data.rows.item(i).category_id,
          desc: data.rows.item(i).category_desc,
        });
      }
      this.totalRow = i;
      // this.showList = true;
    });
    await this.getData();
  }

  async getData() {
    this.arrList = [];
    for (let a = 0; a < this.arrCategory.length; a++) {
      let where = `where c.id_outlet='${this.idOutlet}' and a.category_id='${this.arrCategory[a].id}'`;
      let params = {
        select:
          'a.category_id, a.name_item,  ifnull(b.bagus,0) bagus, ifnull(b.rusak,0) rusak',
        table:
          'item a left join tx_stok b on a.code = b.code left join tx_category c on c.category_id = a.category_id ',
        where: where,
        order: 'ORDER BY a.category_id ASC, a.code ASC',
      };

      await this.database._getData(params).then(async (data) => {
        let arrPush = [];
        for (var i = 0; i < data.rows.length; i++) {
          arrPush.push({
            desc: data.rows.item(i).name_item,
            bagus: data.rows.item(i).bagus,
            rusak: data.rows.item(i).rusak,
          });
        }
        this.arrList[this.arrCategory[a].id] = arrPush;
      });
    }
    this.showList = true;
  }

  async refreshData(event) {
    this.fakeCategory = new Array(this.totalRow);
    this.showList = false;
    await this.getCategory();
    event.target.complete();
  }
}
