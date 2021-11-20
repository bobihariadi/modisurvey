import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {
  idOutlet: string;
  arrList: any = [];
  idParam: any = [];
  isYes: any = [];

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
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
        await this.getSurvey();
      }
    });
  }

  async getSurvey() {
    // await this.bacaItem('tx_survey');
    let groupOutlet = await this.getGroupOutlet(this.idOutlet);
    let where = `where id_outlet='${this.idOutlet}' and group_outlet='${groupOutlet}'`;

    let params = {
      select: 'id, id_outlet,group_outlet, survey_desc, is_yes',
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
        });
        this.idParam[data.rows.item(i).id] = data.rows.item(i).id;
        this.isYes[data.rows.item(i).id] = data.rows.item(i).is_yes;
      }
    });
  }

  async getGroupOutlet(idoutlet) {
    return new Promise((resolve) => {
      let params = {
        select: '*',
        table: 'outlet',
        where: 'where id_outlet =' + idoutlet,
        order: '',
      };
      this.database._getData(params).then(async (data) => {
        console.log(data);
        if (data.rows.length > 0) {
          resolve(data.rows.item(0).group_outlet);
        } else {
          resolve('');
        }
      });
    });
  }

  myBackButton() {
    this.router.navigate(['listmenu']);
  }

  async confimData() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Simpan Survey?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Ya',
          handler: async () => {
            await this.commitSave();
            await this.showTost('Data berhasil disimpan');
            timer(2000).subscribe(() => this.router.navigate(['listmenu']));
          },
        },
      ],
    });

    await alert.present();
  }

  async commitSave() {
    for (let i = 0; i < this.arrList.length; i++) {
      if (this.idParam[this.arrList[i].id] || this.isYes[this.arrList[i].id]) {
        let params = {
          table: 'tx_survey',
          set: `is_yes='${this.isYes[this.arrList[i].id]}'`,
          where: `id = '${this.idParam[this.arrList[i].id]}' and id_outlet ='${
            this.idOutlet
          }' and is_sync='N'`,
        };
        await this.updateData(params);
      }
    }
  }

  async updateData(params: any) {
    return new Promise((resolve) => {
      this.database._editData(params).then((data) => {
        resolve(data);
      });
    });
  }

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 1000,
      position: 'bottom',
      cssClass: 'myToast',
    });
    toast.present();
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
