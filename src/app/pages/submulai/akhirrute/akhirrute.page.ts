import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-akhirrute',
  templateUrl: './akhirrute.page.html',
  styleUrls: ['./akhirrute.page.scss'],
})
export class AkhirrutePage implements OnInit {
  dateBegin: any = '';
  startDate: any = '';
  jamAkhir: string;
  arrDays: any[] = [
    { day: 'Sun', hari: 'Minggu' },
    { day: 'Mon', hari: 'Senin' },
    { day: 'Tue', hari: 'Selasa' },
    { day: 'Wed', hari: 'Rabu' },
    { day: 'Thu', hari: 'Kamis' },
    { day: 'Fri', hari: "Jum'at" },
    { day: 'Sat', hari: 'Sabtu' },
  ];

  token: string;
  idUser: any;
  serverAddress: string;

  constructor(
    private router: Router,
    private alerCtrl: AlertController,
    private toastCtrl: ToastController,
    private platform: Platform,
    public database: DatabaseService,
    private storageCtrl: Storage,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        await this.storageCtrl.create();
        this.storageCtrl.get('dataLogin').then(async (data) => {
          this.idUser = data.id;
        });
        await this.storageCtrl.get('token').then(async (data) => {
          this.token = data;
        });
        await this.getData();
      }
    });
  }

  getDay(param) {
    return this.arrDays.find((x) => x.day === param);
  }

  async getData() {
    // await this.bacaItem('tx_merchandising');
    this.dateBegin = new Date();
    this.startDate = this.dateBegin.toISOString();
    var d = await this.dateBegin;
    var dayName = d.toString().split(' ')[0];
    var hms = d.toString().split(' ')[4];
    let days = await this.getDay(dayName);

    let newDate = new Date(this.startDate.split('T')[0]);

    this.jamAkhir =
      days.hari +
      ', ' +
      newDate.getDate() +
      '-' +
      newDate.getMonth() +
      '-' +
      newDate.getFullYear() +
      '  ' +
      hms;

    // await this.bacaItem('itenary');
    // await this.bacaItem('outlet');
  }

  async refreshData(event) {
    await this.getData();
    event.target.complete();
  }

  myBackButton() {
    this.router.navigateByUrl('mulai');
  }

  async confimData(param) {
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Akhiri kunjungan?',
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
            const loading = await this.loadingCtrl.create({
              cssClass: 'my-custom-class',
              message: 'Finishing....',
            });
            await loading.present();
            await this.updateMerchandising();
            // this.bacaItem('itenary');
            // await this.showTost('Data berhasil disimpan');
            // timer(2000).subscribe(() =>
            //   this.router.navigateByUrl('tabs/tabs/home')
            // );
          },
        },
      ],
    });

    await alert.present();
  }

  async updateMerchandising() {
    // await this.bacaItem('tx_merchandising');
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
        end_at: dateTime,
        status: 'finished',
      },
    };

    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });

    let arrMerchandising = await this.getMerchandising();

    this.http
      .put(
        `${this.serverAddress}` +
          'merchandising_activities/' +
          arrMerchandising['id'],
        arrParam,
        {
          headers: headers,
          // params: params,
          observe: 'response',
        }
      )
      .subscribe(
        async (data: any) => {
          // console.log(data);
          let params = {
            table: 'tx_merchandising',
            set: `end_date='${dateTime}',is_active="N"`,
            where: 'id=' + arrMerchandising['id'],
          };

          await this.updateData(params);
          this.showToast('Selesai');
          this.loadingCtrl.dismiss();
          setTimeout(() => {
            this.router.navigate(['tabs/tabs/home']);
          }, 2000);
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async updateData(params: any) {
    return new Promise((resolve) => {
      this.database._editData(params).then((data) => {
        resolve(data);
      });
    });
  }

  async getMerchandising() {
    return new Promise((resolve) => {
      let params = {
        select: '*',
        table: 'tx_merchandising',
        where: 'where is_active="Y"',
        order: '',
      };
      this.database._getData(params).then(async (data) => {
        console.log('total row : ' + data.rows.length);
        if (data.rows.length > 0) {
          resolve(data.rows.item(0));
        } else {
          resolve('');
        }
      });
    });
  }

  async showToast(param) {
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
