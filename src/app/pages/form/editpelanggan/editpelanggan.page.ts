import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { timer } from 'rxjs';

@Component({
  selector: 'app-editpelanggan',
  templateUrl: './editpelanggan.page.html',
  styleUrls: ['./editpelanggan.page.scss'],
})
export class EditpelangganPage implements OnInit {
  lat: any = '';
  long: any = '';

  constructor(
    private router: Router,
    private alerCtrl: AlertController,
    private toastCtrl: ToastController,
    private geoCtrl: Geolocation,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.getLatlong();
  }

  myBackButton() {
    this.router.navigate(['dalamrute']);
  }

  async confimData(param) {
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Mulai kunjungan?',
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
            await this.showTost('Data berhasil disimpan');
            timer(2000).subscribe(() => this.router.navigate(['dalamrute']));
          },
        },
      ],
    });

    await alert.present();
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

  async getLatlong() {
    await this.showLoading();
    this.geoCtrl
      .getCurrentPosition()
      .then(async (resp) => {
        this.lat = await resp.coords.latitude;
        this.long = await resp.coords.longitude;
        this.loadingCtrl.dismiss();
      })
      .catch((error) => {
        // console.log('Error getting location', error)
        this.loadingCtrl.dismiss();
        this.showTost('Error getting location: ' + error);
      });
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
}
