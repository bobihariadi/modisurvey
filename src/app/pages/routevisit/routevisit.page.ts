import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-routevisit',
  templateUrl: './routevisit.page.html',
  styleUrls: ['./routevisit.page.scss'],
})
export class RoutevisitPage implements OnInit {
  idParam: any;
  labelButton: string = 'EDIT';
  labelStart: string = 'Start Visit';
  isReadonly: boolean = true;
  isDisabled: boolean = false;

  kode: string;
  nama: string;
  alamat: string;
  kel: string;
  kec: string;
  kota: string;
  kodePos: string;
  kontak: string;
  noHp: string;
  lat: string;
  long: string;
  status: string;

  latitude: any = '';
  longitude: any = '';

  errGps: number = 0;
  reason: string;

  isOutRadius: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public database: DatabaseService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private storageCtrl: Storage,
    private geoCtrl: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async ngOnInit() {
    await this.storageCtrl.create();
    this.idParam = this.route.snapshot.paramMap.get('idParam');
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        this.getOutlet();
      }
    });
  }

  async getOutlet() {
    let params = {
      select: 'b.*, a.status',
      table: 'outlet b left join  itenary a on a.id_outlet=b.id_outlet',
      where: 'WHERE a.id = ' + this.idParam,
      order: '',
    };
    await this.database._getData(params).then(async (data) => {
      const arrData = [];
      for (var i = 0; i < data.rows.length; i++) {
        // arrData.push(data.rows.item(i));
        const row = data.rows.item(i);
        this.kode = row.id_outlet;
        this.nama = row.name_outlet;
        this.alamat = row.address;
        this.kel = row.kelurahan;
        this.kec = row.kecamatan;
        this.kota = row.kota;
        this.kodePos = row.kdpos;
        this.kontak = row.kontak;
        this.noHp = row.hp;
        this.lat = row.lat;
        this.long = row.long;
        this.status = row.status;
      }

      if (this.status == '3') {
        this.labelStart = 'Continue Visit';
      } else if (this.status == '2') {
        this.labelStart = 'Visit Done';
        this.isDisabled = true;
      }
    });

    if (this.idParam == 'null') {
      this.isDisabled = true;
    }
  }

  async saveEdit() {
    if (this.labelButton == 'EDIT' && this.lat == '' && this.long == '') {
      this.labelButton = 'SAVE';
      this.isReadonly = false;
      return false;
    }
    this.labelButton = 'EDIT';
    this.isReadonly = true;
  }

  async startVisit() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: this.labelStart + '?',
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
            await this.updateItenary();
          },
        },
      ],
    });

    await alert.present();
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

  async updateItenary() {
    console.log(this.isOutRadius + '|' + this.idParam + '|' + this.errGps);

    // this.bacaItem('itenary');
    let isTrue = await this.getItenary(this.idParam);
    if (isTrue) {
      this.storageCtrl.set('idOutlet', this.kode);
      let param = {
        id: this.idParam,
        kode: this.kode,
        nama: this.nama,
      };
      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(param),
        },
      };

      // loading.dismiss();
      this.router.navigate(['listmenu'], navigationExtras);

      return false;
    } else {
      const loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: 'Cek Posisi...',
      });
      await loading.present();
    }

    await this.getLatLong();

    // cek posisi dengan outlet
    await this.checkPosition();
    if (this.isOutRadius) {
      return false;
    }
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

    let params = {
      table: 'itenary',
      set:
        "status = '3', start_date= '" +
        dateTime +
        "', start_lat='" +
        this.latitude +
        "', start_long='" +
        this.longitude +
        "', reason='" +
        this.reason +
        "' ",
      where: 'id = ' + this.idParam,
    };
    // console.log(params);

    this.database._editData(params).then((data) => {
      if (data) {
        this.storageCtrl.set('idOutlet', this.kode);
        let param = {
          id: this.idParam,
          kode: this.kode,
          nama: this.nama,
        };
        let navigationExtras: NavigationExtras = {
          queryParams: {
            special: JSON.stringify(param),
          },
        };

        this.router.navigate(['listmenu'], navigationExtras);
      }
    });
  }

  async checkPosition() {
    let jarak: any = await this.getDistanceFromLatLonInKm(
      this.latitude,
      this.longitude,
      this.lat,
      this.long
    );
    jarak = Math.round(jarak);

    if (Number(jarak) > 100) {
      this.loadingCtrl.dismiss();
      this.errGps = this.errGps + 1;
      if (this.errGps < 3) {
        await this.showToast(
          'Posisi outlet tidak sesuai, jarak anda ' +
            Number(jarak) +
            ' meter dari outlet',
          4000
        );
        return false;
      }
      await this.goNext();
    } else {
      this.isOutRadius = false;
      this.loadingCtrl.dismiss();
      await this.showToast(
        'Jarak anda ' + Number(jarak) + ' meter dari outlet',
        4000
      );
    }
  }

  async goNext() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message:
        'Validasi kunjungan dengan GPS gagal. Apakah ingin melanjutkan kunjungan tanpa validasi kunjungan?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            this.errGps = 2;
            this.isOutRadius = true;
          },
        },
        {
          text: 'Ya',
          handler: async () => {
            this.showActionsheet();
          },
        },
      ],
    });

    await alert.present();
  }

  async showActionsheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Alasan',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Gagal karena GPS error',
          role: 'destructive',
          icon: 'navigate-circle-outline',
          handler: () => {
            this.isOutRadius = false;
            this.reason = 'Gagal karena GPS error';
            this.errGps = 0;
            this.updateItenary();
            // this.router.navigateByUrl('listmenu');
          },
        },
        {
          text: 'Gagal karena dalam gedung',
          role: 'destructive',
          icon: 'business-outline',
          handler: () => {
            this.isOutRadius = false;
            this.reason = 'Gagal karena dalam gedung';
            this.errGps = 0;
            this.updateItenary();
            // this.router.navigateByUrl('listmenu');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = await this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = await this.deg2rad(lon2 - lon1);
    var a =
      (await Math.sin(dLat / 2)) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = (await 2) * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = (await R) * c; // Distance in km
    return d * 1000; //Distance in Meters
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  async getItenary(idParam) {
    return new Promise((resolve) => {
      let params = {
        select: '*',
        table: 'itenary',
        where: 'where id = ' + idParam + ' and start_date is not null ',
        order: '',
      };
      this.database._getData(params).then(async (data) => {
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

  async showToast(param, time) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: time,
      position: 'bottom',
      cssClass: 'myToast',
    });
    toast.present();
  }
}
