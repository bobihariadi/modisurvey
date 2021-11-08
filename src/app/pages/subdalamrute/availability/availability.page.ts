import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.page.html',
  styleUrls: ['./availability.page.scss'],
})
export class AvailabilityPage implements OnInit {
  fakeList: Array<any> = new Array(5);
  showList: boolean = false;
  arrList: any = [];
  searchTerm: string = '';
  idOutlet: string;

  constructor(
    private router: Router,
    public database: DatabaseService,
    private platform: Platform,
    private storageCtrl: Storage
  ) {}

  async ngOnInit() {
    await this.storageCtrl.create();
    this.storageCtrl.get('idOutlet').then((val) => {
      this.idOutlet = val;
    });

    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        this.getCategory();
      }
    });
  }

  async getCategory() {
    this.bacaItem('tx_category');
    let where = `where id_outlet='${this.idOutlet}'`;

    if (this.searchTerm != '') {
      where = where + " and category_desc like '%" + this.searchTerm + "%'";
    }

    let params = {
      select: 'category_id, category_desc, max_item',
      table: 'tx_category',
      where: where,
      order: '',
    };

    await this.database._getData(params).then(async (data) => {
      this.arrList = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.arrList.push({
          item: data.rows.item(i).category_desc,
          code: data.rows.item(i).category_id,
          max: data.rows.item(i).max_item,
        });
      }
      this.showList = true;
    });
  }

  async refreshData(event) {
    this.showList = false;
    event.target.complete();
    this.getCategory();
  }

  setFilteredItems(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.getCategory();
  }

  cleared(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.getCategory();
  }

  async goToDetail(code, desc, max) {
    let navExtra: NavigationExtras = {
      state: {
        code: code,
        desc: desc,
        max: max,
      },
    };
    await this.router.navigate(['availability/listdetail'], navExtra);
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
