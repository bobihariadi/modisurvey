import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {
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
        await this.getSurvey();
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

  async getSurvey() {
    let where = `where id_outlet='${this.idOutlet}'`;

    let params = {
      select:
        'id, id_outlet, survey_desc, case when is_yes="Y" then "Ya" else "Tidak" end as is_yes ',
      table: 'tx_survey',
      where: where,
      order: '',
    };

    await this.database._getData(params).then(async (data) => {
      this.arrList = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.arrList.push({
          id: data.rows.item(i).id,
          desc: data.rows.item(i).survey_desc,
          is_yes: data.rows.item(i).is_yes,
        });
        this.totalRow = i;
      }
      this.showList = true;
    });
  }

  async refreshData(event) {
    this.fakeList = new Array(this.totalRow);
    this.showList = false;
    await this.getSurvey();
    event.target.complete();
  }
}
