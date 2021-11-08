import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  subscription: any;

  type: string = 'MARCHANDISER';
  userID: string = 'MD-JKT-01';
  nama: string = 'MESSI';
  area: string = 'JAKARTA';
  route: string = 'JAKARTA UTARA';
  hp: string = '081374336102';
  password: string = 'pass123abc';
  isReadOnly: boolean = true;

  serverAddress: string;
  port: string;

  constructor(
    private alertCtrl: AlertController,
    private storageCtrl: Storage,
    private loadingCtrl: LoadingController,
    private router: Router,
    private platform: Platform,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  async actLogout() {
    await this.storageCtrl.create();
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

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

    this.storageCtrl.clear();

    await this.storageCtrl.set('sAddress', this.serverAddress);
    await this.storageCtrl.set('sPort', this.port);

    loading.dismiss();
    this.router.navigate(['login'], { replaceUrl: true });
  }

  async goLogout() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alert!',
      message: 'Are you sure to <strong>logout</strong>!!!',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Yes',
          handler: async () => {
            await this.actLogout();
          },
        },
      ],
    });

    await alert.present();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if (window.location.pathname == '/tabs/tabs/account') {
        this.router.navigate(['tabs/tabs/home'], { replaceUrl: true });
      }
    });
  }

  changePass() {
    this.isReadOnly = false;
  }

  async savePass() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Simpan password?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.isReadOnly = false;
          },
        },
        {
          text: 'Ya',
          handler: async () => {
            await this.commitSavePass();
          },
        },
      ],
    });

    await alert.present();
  }

  async commitSavePass() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon tunggu...',
    });
    await loading.present();

    setTimeout(() => {
      loading.dismiss();
      this.showToast('Berhasil simpan password');
      this.isReadOnly = true;
    }, 4000);
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
}
