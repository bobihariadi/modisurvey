import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-listdetail',
  templateUrl: './listdetail.page.html',
  styleUrls: ['./listdetail.page.scss'],
})
export class ListdetailPage implements OnInit {
  idUser: any;
  params: any;
  fakeList: Array<any> = new Array(3);
  showList: boolean = false;
  bagus: any = [];
  rusak: any = [];
  idOutlet: string;
  arrList: any = [];
  labelForm: string = 'Save';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public database: DatabaseService,
    private platform: Platform,
    private storageCtrl: Storage
  ) {
    this.route.queryParams.subscribe(async () => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.params = this.router.getCurrentNavigation().extras.state;
      }
    });
  }

  async ngOnInit() {
    this.storageCtrl.create();
    await this.storageCtrl.get('idOutlet').then(async (val) => {
      this.idOutlet = await val;
    });

    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.storageCtrl.get('dataLogin').then(async (data) => {
          this.idUser = data.id;
        });
        await this.database.createDatabase();
        await this.getItem();
      }
    });
  }

  async getTxItem() {
    let param = {
      select: 'code, bagus, rusak',
      table: 'tx_stok',
      where: `WHERE id_outlet='${this.idOutlet}' and category_id='${this.params.code}'`,
      order: ' ORDER BY code ASC',
    };
    await this.database._getData(param).then(async (data) => {
      for (let i = 0; i < data.rows.length; i++) {
        this.bagus[data.rows.item(i).code] = data.rows.item(i).bagus || 0;
        this.rusak[data.rows.item(i).code] = data.rows.item(i).rusak || 0;
        this.labelForm = 'Update';
      }
    });
  }

  async getItem() {
    let param = {
      select: 'code, name_item, image_blob',
      table: 'item',
      where: `WHERE category_id='${this.params.code}' `,
      order: 'order by name_item ASC',
    };
    // this.bacaItem('item');
    this.database._getData(param).then(async (data) => {
      this.arrList = [];
      for (var i = 0; i < data.rows.length; i++) {
        await this.arrList.push({
          code: data.rows.item(i).code,
          item: data.rows.item(i).name_item,
          image: data.rows.item(i).image_blob,
        });
      }
      // console.log(this.arrList);
      this.showList = true;
      await this.getTxItem();
    });
  }

  async cekMaxItem(e: any, code: any, tipe: String) {
    let bagus = Number(this.bagus[code] || 0);
    let rusak = Number(this.rusak[code] || 0);

    const total = bagus + rusak;
    let max = Number(this.params.max);

    if (max < total) {
      await this.notifMax(code, tipe);
    }
  }

  async notifMax(code: any, tipe: String) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Total item melebihi maximum item (' + this.params.max + ')!',
      buttons: [
        {
          text: 'Ok',
          handler: async () => {
            if (tipe == 'bagus') {
              this.bagus[code] = 0;
            } else {
              this.rusak[code] = 0;
            }
          },
        },
      ],
    });

    await alert.present();
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

  myBackButton() {
    this.router.navigate(['availability']);
  }

  async confimData() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: this.labelForm + ' data Availability?',
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
            timer(2000).subscribe(() => this.router.navigate(['availability']));
          },
        },
      ],
    });

    await alert.present();
  }

  async commitSave() {
    for (let i = 0; i < this.arrList.length; i++) {
      if (
        this.bagus[this.arrList[i].code] ||
        this.rusak[this.arrList[i].code]
      ) {
        let delParams = {
          table: 'tx_stok',
          where: `WHERE id_outlet='${this.idOutlet}' and code='${this.arrList[i].code}'`,
        };
        await this.deleteData(delParams);

        let params = {
          table: 'tx_stok',
          field: 'code,id_outlet,id_user,bagus,rusak, category_id',
          value: `'${this.arrList[i].code}','${this.idOutlet}','${
            this.idUser
          }','${this.bagus[this.arrList[i].code] || 0}','${
            this.rusak[this.arrList[i].code] || 0
          }', '${this.params.code}'`,
        };
        await this.insertData(params);
      }
    }
  }

  async deleteData(params: any) {
    return new Promise((resolve) => {
      this.database._deleteData(params).then((data) => {
        resolve(data);
      });
    });
  }

  async insertData(params: any) {
    return new Promise((resolve) => {
      this.database._addData(params).then((data) => {
        resolve(data);
      });
    });
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
}
