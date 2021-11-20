import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  Platform,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-listmenu',
  templateUrl: './listmenu.page.html',
  styleUrls: ['./listmenu.page.scss'],
})
export class ListmenuPage implements OnInit {
  jamAwal: string;
  arrDays: any[] = [
    { day: 'Sun', hari: 'Minggu' },
    { day: 'Mon', hari: 'Senin' },
    { day: 'Tue', hari: 'Selasa' },
    { day: 'Wed', hari: 'Rabu' },
    { day: 'Thu', hari: 'Kamis' },
    { day: 'Fri', hari: "Jum'at" },
    { day: 'Sat', hari: 'Sabtu' },
  ];
  dateBegin: any = '';
  startDate: any = '';
  labelHeader: string;
  idParam: any;

  serverAddress: string;
  token: string;
  idUser: any;
  activity_id: any;

  idOutlet: any;

  arrDataAvailability: any = [];
  arrDataVisibility: any = [];
  arrDataSurvey: any = [];

  latitude: any;
  longitude: any;

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute,
    private storageCtrl: Storage,
    private platform: Platform,
    public database: DatabaseService,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private geoCtrl: Geolocation
  ) {}

  async ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        await this.storageCtrl.create();
        this.storageCtrl.get('dataLogin').then(async (data) => {
          this.idUser = data.id;
        });
        this.storageCtrl.get('token').then(async (data) => {
          this.token = data;
        });
        this.storageCtrl.get('idOutlet').then(async (data) => {
          this.idOutlet = data;
        });
      }
    });

    this.activatedRoute.queryParams.subscribe(async (params) => {
      if (params && params.special) {
        const arrParam = JSON.parse(params.special);
        this.idParam = await arrParam.id;
        this.labelHeader = arrParam.kode + ' | ' + arrParam.nama;
      }
    });
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

  refreshData(event) {
    // this.page = 0;
    // this.showList = false;
    // this.searchTerm = '';
    // event.target.disabled = false;
    // this.getData(event);
    event.target.complete();
    // event.target.disabled = false;
  }

  async uploadVisit() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Upload data visit?',
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
            await this.commitUploadVisit();
          },
        },
      ],
    });

    await alert.present();
  }

  async commitUploadVisit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Uploading....',
    });
    await loading.present();

    // get visit activity id
    await this.getVisitActivity(); //ok
  }

  async sendSurvey() {
    await this.bacaItem('tx_survey');

    let params = {
      select: '*',
      table: 'tx_survey',
      where: 'where is_sync="N" and id_outlet=' + this.idOutlet,
      order: '',
    };
    let stat = false;
    await this.database._getData(params).then(async (data) => {
      this.arrDataSurvey = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let arrItem = {
            answer: data.rows.item(i).is_yes == 'Y' ? 'yes' : 'no',
            survey_question_id: data.rows.item(i).id,
            visit_activity_id: this.activity_id,
          };
          this.arrDataSurvey.push(arrItem);
        }
      } else {
        console.log('data not found');
        stat = true;
      }
    });

    if (stat) {
      return false;
    }

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    this.http
      .post(`${this.serverAddress}` + 'survey_activities', this.arrDataSurvey, {
        headers: headers,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          if (data.body.status == 'success') {
            let params = {
              table: 'tx_survey',
              set: 'is_sync="Y"',
              where: 'is_sync="N" and id_outlet=' + this.idOutlet,
            };
            await this.updateData(params);
          }
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async getLatLong() {
    await this.geoCtrl
      .getCurrentPosition()
      .then(async (resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
      })
      .catch((error) => {
        console.log('Error getting location: ' + error);
      });
  }

  async setVisitActivities() {
    await this.getLatLong();
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

    let arrItenary = await this.getItenary();
    // const params = new HttpParams().set('id', arrItenary['id']);

    let arrParam = {
      visit_activity: {
        end_at: dateTime,
        end_point_latitude: this.latitude,
        end_point_longitude: this.longitude,
        status: 'finished',
      },
    };

    if (arrItenary['status'] == '2') {
      console.log('sudah selesai upload');
      this.showToast('Upload Visit Selesai');
      this.loadingCtrl.dismiss();
      setTimeout(() => {
        this.router.navigate(['mulai']);
      }, 2000);
      return false;
    }

    this.http
      .put(
        `${this.serverAddress}` +
          'visit_activities/' +
          arrItenary['activity_id'],
        arrParam,
        {
          headers: headers,
          // params: params,
          observe: 'response',
        }
      )
      .subscribe(
        async (data: any) => {
          console.log(data);
          let params = {
            table: 'itenary',
            set: `end_date='${dateTime}',end_lat='${this.latitude}', end_long='${this.longitude}', status="2"`,
            where: 'id=' + arrItenary['id'],
          };

          await this.updateData(params);
          this.showToast('Upload Visit Selesai');
          this.loadingCtrl.dismiss();
          setTimeout(() => {
            this.router.navigate(['mulai']);
          }, 2000);
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async sendVisibility() {
    await this.bacaItem('tx_photo');

    let params = {
      select: '*',
      table: 'tx_photo',
      where: 'where is_sync="N" and id_outlet=' + this.idOutlet,
      order: '',
    };
    let stat = false;
    await this.database._getData(params).then(async (data) => {
      this.arrDataVisibility = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let arrItem = {
            visit_activity_id: this.activity_id,
            visibility_activity_id: data.rows.item(i).id_visibility,
            image: 'data:image/jpeg;base64,' + data.rows.item(i).image_blob,
          };
          this.arrDataVisibility.push(arrItem);
        }
      } else {
        console.log('data not found');
        stat = true;
      }
    });

    if (stat) {
      return false;
    }

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    this.http
      .post(`${this.serverAddress}` + 'visibilities', this.arrDataVisibility, {
        headers: headers,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          if (data.body.status == 'success') {
            let params = {
              table: 'tx_photo',
              set: 'is_sync="Y"',
              where: 'is_sync="N" and id_outlet=' + this.idOutlet,
            };
            console.log(params);
            await this.updateData(params);
          }
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async sendAvailability() {
    let params = {
      select: '*',
      table: 'tx_stok',
      where: 'where is_sync="N" and id_outlet=' + this.idOutlet,
      order: '',
    };
    let stat = false;
    await this.database._getData(params).then(async (data) => {
      this.arrDataAvailability = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let arrItem = {
            bad_stock: data.rows.item(i).rusak,
            good_stock: data.rows.item(i).bagus,
            item_id: data.rows.item(i).id,
            visit_activity_id: this.activity_id,
          };
          this.arrDataAvailability.push(arrItem);
        }
      } else {
        console.log('data not found');
        stat = true;
      }
    });

    if (stat) {
      return false;
    }

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    this.http
      .post(
        `${this.serverAddress}` + 'availabilities',
        this.arrDataAvailability,
        {
          headers: headers,
          observe: 'response',
        }
      )
      .subscribe(
        async (data: any) => {
          if (data.body.status == 'success') {
            let params = {
              table: 'tx_stok',
              set: 'is_sync="Y"',
              where: 'is_sync="N" and id_outlet=' + this.idOutlet,
            };
            console.log(params);
            await this.updateData(params);
          }
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async getVisitActivity() {
    // let params = {
    //   table: 'itenary',
    //   set: `status="3"`,
    //   where: 'id=1',
    // };

    // await this.updateData(params);

    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });

    let isTrue = await this.cekVisited();
    if (isTrue) {
      console.log('sudah ada');
      return false;
    }
    console.log('belum ada');

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

    let arrItenary = await this.getItenary();

    let arrParam = {
      visit_activity: {
        merchandising_activity_id: await this.getMerchandisingId(),
        outlet_id: arrItenary['id_outlet'],
        start_at: arrItenary['start_date'],
        start_point_latitude: arrItenary['start_lat'],
        start_point_longitude: arrItenary['start_long'],
      },
    };

    this.http
      .post(`${this.serverAddress}` + 'visit_activities', arrParam, {
        headers: headers,
        // params: params,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          this.activity_id = await data.body.visit_activity.id;

          let params = {
            table: 'itenary',
            set: `activity_id='${data.body.visit_activity.id}',activity_code='${data.body.visit_activity.code}'`,
            where: 'id=' + arrItenary['id'],
          };

          await this.updateData(params);
          console.log('-----------');

          //send availability
          await this.sendAvailability(); //ok

          //send  visibility
          await this.sendVisibility(); //ok

          //send survey
          await this.sendSurvey(); //ok

          //update visit activities
          await this.setVisitActivities();
          // this.bacaItem('itenary');
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async cekVisited() {
    // this.bacaItem('itenary');
    return new Promise(async (resolve) => {
      let params = {
        select: '*',
        table: 'itenary',
        where: 'where id=' + this.idParam + '  and activity_id is not null',
        order: '',
      };
      await this.database._getData(params).then(async (data) => {
        if (data.rows.length > 0) {
          this.activity_id = await data.rows.item(0).activity_id;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async getItenary() {
    return new Promise((resolve) => {
      let params = {
        select: '*',
        table: 'itenary',
        where: 'where id=' + this.idParam,
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

  async getMerchandisingId() {
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
          resolve(data.rows.item(0).id);
        } else {
          resolve('');
        }
      });
    });
  }

  async confirmAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Jawab dan isilah survey?',
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
            this.router.navigate(['survey']);
          },
        },
      ],
    });

    await alert.present();
  }

  async goToConfirm() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selesai Kunjungan',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Akhir Kunjungan',
          role: 'destructive',
          icon: 'stop-circle-outline',
          handler: () => {
            this.stopSurvey();
          },
        },
        {
          text: 'Tunda Kunjungan',
          role: 'destructive',
          icon: 'pause-circle-outline',
          handler: () => {
            // this.router.navigateByUrl('listmenu')
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async stopSurvey() {
    await this.getData();
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Akhiri kunjungan saat ini dengan SUKSES?<br>  ' + this.jamAwal,
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
            this.alertSuccess();
          },
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  async alertSuccess() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message:
        'Kunjungan telah BERHASIL DAN SUKSES<br>Waktu yang dibutuhkan untuk kunjungan ini adalah 15 menit.',
      buttons: [
        {
          text: 'Ok',
          handler: async () => {
            this.confirmUpload();
          },
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  async confirmUpload() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Anda ingin upload data?',
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
            await this.showLoading();
            this.doUpload();
          },
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  async doUpload() {
    timer(2000).subscribe(() => this.loadingCtrl.dismiss());

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Upload online selesai',
      buttons: [
        {
          text: 'Ok',
          handler: async () => {
            this.router.navigate(['kunjungan']);
          },
        },
      ],
      backdropDismiss: false,
    });

    timer(2500).subscribe(() => alert.present());
  }

  getDay(param) {
    return this.arrDays.find((x) => x.day === param);
  }

  async getData() {
    this.dateBegin = new Date();
    this.startDate = this.dateBegin.toISOString();
    var d = await this.dateBegin;
    var dayName = d.toString().split(' ')[0];
    var hms = d.toString().split(' ')[4];
    let days = await this.getDay(dayName);

    let newDate = new Date(this.startDate.split('T')[0]);

    this.jamAwal =
      days.hari +
      ', ' +
      newDate.getDate() +
      '-' +
      newDate.getMonth() +
      '-' +
      newDate.getFullYear() +
      '  ' +
      hms;
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000,
      backdropDismiss: false,
    });
    await loading.present();
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

  async updateData(params: any) {
    return new Promise((resolve) => {
      this.database._editData(params).then((data) => {
        resolve(data);
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
