import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-newoutlet',
  templateUrl: './newoutlet.page.html',
  styleUrls: ['./newoutlet.page.scss'],
})
export class NewoutletPage implements OnInit {
  labelButton: string = 'SAVE';

  kode: string;
  nama: string;
  alamat: string;
  kel: string;
  kec: string;
  kota: string;
  kodePos: string;
  kontak: string;
  noHp: string;
  lat: any;
  long: any;
  is_new: string = 'Y';
  arrList: any = [];

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private geoCtrl: Geolocation,
    private platform: Platform,
    public database: DatabaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        await this.getLatLong();
        await this.getOutlet();
      }
    });
  }

  async getOutlet() {
    let params = {
      select: '*',
      table: 'outlet',
      where: '',
      order: '',
    };
    await this.database._getData(params).then(async (data) => {
      this.arrList = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.arrList.push(data.rows.item(i));
      }
    });

    console.log(this.arrList);
  }

  async getLatLong() {
    await this.geoCtrl
      .getCurrentPosition()
      .then(async (resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        console.log('lat: ' + this.lat + '\nlong: ' + this.long);
      })
      .catch((error) => {
        this.showToast('Error getting location: ' + error);
        console.log('Error getting location: ' + error);
      });
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

  async saveForm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Start Visit?',
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
            await this.confirmSave();
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmSave() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon tunggu...',
    });
    await loading.present();

    let params = {
      table: 'outlet',
      field:
        'id_outlet,name_outlet,address, kelurahan, kecamatan, kota, kdpos, kontak,hp, lat, long, is_new',
      value: `'${this.kode}','${this.nama}','${this.alamat}','${this.kel}','${this.kec}','${this.kota}','${this.kodePos}','${this.kontak}','${this.noHp}','${this.lat}','${this.long}','Y'`,
    };

    this.database._addData(params).then(async (data) => {
      console.log(data);
      if (data) {
        await this.showToast('Data berhasil ditambahkan');

        setTimeout(async () => {
          await this.router.navigateByUrl('mulai');
        }, 2000);
      }

      loading.dismiss();
    });
  }
}
