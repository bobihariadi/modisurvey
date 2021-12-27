import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  serverAddress: string = 'http://128.199.245.1/api/v1/';
  // serverAddress: string = 'https://dinus.gruper.co/api/';
  port: string = '8080';

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private storageCtrl: Storage
  ) {}

  async ngOnInit() {
    await this.storageCtrl.create();
    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });
    await this.storageCtrl.get('sPort').then(async (val) => {
      if (val) {
        this.port = val;
      }
    });
  }

  goBack() {
    this.router.navigate(['login'], { replaceUrl: true });
  }

  async saveForm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Simpan data ini?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Ya',
          handler: () => {
            this.saveFormCommit();
          },
        },
      ],
    });

    await alert.present();
  }

  async saveFormCommit() {
    if (
      this.serverAddress == null ||
      this.serverAddress == '' ||
      this.port == null ||
      this.port == ''
    ) {
      this.showTost('Data harus isi');
      return false;
    }

    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon tunggu...',
    });
    await loading.present();

    await this.storageCtrl.set('sAddress', this.serverAddress);
    await this.storageCtrl.set('sPort', this.port);

    setTimeout(() => {
      loading.dismiss();
      this.showTost('Success');
    }, 1000);
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
