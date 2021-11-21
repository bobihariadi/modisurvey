import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-itenary',
  templateUrl: './itenary.page.html',
  styleUrls: ['./itenary.page.scss'],
})
export class ItenaryPage implements OnInit {
  fakeList: Array<any> = new Array(5);
  showList: boolean = false;
  arrList: any = [];

  constructor(
    private platform: Platform,
    public database: DatabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        await this.getItenary();
      }
    });
  }

  async refreshData(event) {
    this.showList = false;
    event.target.complete();
    this.getItenary();
  }

  async getItenary() {
    let params = {
      select:
        'a.id, b.name_outlet, b.address, a.status, case when a.status= "1" then "Belum dikunjungi" when a.status= "2" then "Sudah dikunjungi" when a.status="3" then "Pending" when a.status="4" then "Void" else "Belum jadwal" end arr_status',
      table: 'itenary a left join outlet b on a.id_outlet = b.id_outlet',
      where: '',
      order: 'ORDER BY a.id ASC',
    };
    await this.database._getData(params).then(async (data) => {
      this.arrList = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.arrList.push(data.rows.item(i));
      }
    });

    this.showList = true;
  }

  async routeVisit(params) {
    this.router.navigate(['routevisit', { idParam: params }]);
  }

  viewMap() {
    this.router.navigateByUrl('maps');
  }
}
