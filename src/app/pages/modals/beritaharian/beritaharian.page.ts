import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-beritaharian',
  templateUrl: './beritaharian.page.html',
  styleUrls: ['./beritaharian.page.scss'],
})
export class BeritaharianPage implements OnInit {
  fakeList: Array<any> = new Array(3);
  showList: boolean = false;
  arrList: any = [];
  serverAddress: string;
  token: string;
  merchandisingId: number;
  idUser: any;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private storageCtrl: Storage,
    private http: HttpClient,
    private platform: Platform,
    public database: DatabaseService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        timer(500).subscribe(() => (this.showList = true));
        await this.database.createDatabase();
        await this.storageCtrl.create();
        this.storageCtrl.get('dataLogin').then(async (data) => {
          this.idUser = data.id;
        });
        await this.storageCtrl.get('token').then(async (data) => {
          this.token = data;
        });
        await this.getBerita();
      }
    });
  }

  async getBerita() {
    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });
    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    // const params = new HttpParams().set('announce_type', 'areas');

    this.http
      .get(`${this.serverAddress}` + 'announcements', {
        headers: headers,
        // params: params,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          data.body.announcements.forEach((el) => {
            let itemData = {
              name: el.name,
              news_date: el.date_start,
              desc: el.description,
            };

            this.arrList.push(itemData);
          });
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async actClose() {
    await this.modalCtrl.dismiss();
  }

  async actNext() {
    await this.startMerchandising();
    this.router.navigateByUrl('mulai');
    this.modalCtrl.dismiss();
  }

  async startMerchandising() {
    let isTrue = await this.getMerchandising();
    if (isTrue) {
      console.log('masuk');
      return false;
    }
    console.log('lanjut');

    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

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

    let arrParam = {
      merchandising_activity: {
        activity_date: onlyDate,
        start_at: dateTime,
      },
    };

    this.http
      .post(`${this.serverAddress}` + 'merchandising_activities', arrParam, {
        headers: headers,
        // params: params,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          let params = {
            table: 'tx_merchandising',
            field: 'id,code,activity_date,start_at,id_user',
            value: `'${data.body.merchandising_activity.id}','${data.body.merchandising_activity.code}','${onlyDate}','${dateTime}','${this.idUser}'`,
          };

          await this.insertData(params);

          await this.bacaItem('tx_merchandising');
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async refreshData(event) {
    // this.page = 0;
    // this.showList = false;
    // this.searchTerm = '';
    // event.target.disabled = false;
    // this.getData(event);
    event.target.complete();
    // event.target.disabled = false;
  }

  async showToast(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 2000,
      position: 'bottom',
      cssClass: 'myToast',
    });
    toast.present();
  }

  async insertData(params: any) {
    return new Promise((resolve) => {
      this.database._addData(params).then((data) => {
        resolve(data);
      });
    });
  }

  async getMerchandising() {
    return new Promise((resolve) => {
      let params = {
        select: '*',
        table: 'tx_merchandising',
        where: 'where is_active="Y" ',
        order: '',
      };
      this.database._getData(params).then(async (data) => {
        console.log('total row : ' + data.rows.length);
        if (data.rows.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
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
