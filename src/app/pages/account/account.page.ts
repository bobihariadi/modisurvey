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
  lChangeButton: string = 'Change Password';

  serverAddress: string;
  port: string;
  token: string;

  constructor(
    private alertCtrl: AlertController,
    private storageCtrl: Storage,
    private loadingCtrl: LoadingController,
    private router: Router,
    private platform: Platform,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.storageCtrl.create();
        this.storageCtrl.get('dataLogin').then(async (data) => {
          this.nama = data.name;
          this.userID = data.id;
        });
        this.storageCtrl.get('token').then(async (data) => {
          this.token = data;
        });
      }
    });
  }

  async actLogout() {
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

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    this.http
      .delete(`${this.serverAddress}` + 'sessions/' + this.userID, {
        headers: headers,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          this.storageCtrl.clear();

          await this.storageCtrl.set('sAddress', this.serverAddress);
          await this.storageCtrl.set('sPort', this.port);

          await loading.dismiss();
          await this.showToast(data.body.message);
          this.router.navigate(['login'], { replaceUrl: true });
        },
        (err) => {
          loading.dismiss();
          this.showToast(err.error.msg);
        }
      );
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
    if (this.isReadOnly) {
      this.isReadOnly = false;
      this.lChangeButton = 'Cancel';
    } else {
      this.isReadOnly = true;
      this.lChangeButton = 'Change Password';
    }
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

    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    let arrParam = {
      user: {
        password: this.password,
      },
    };

    this.http
      .put(`${this.serverAddress}` + 'sessions/update', arrParam, {
        headers: headers,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          loading.dismiss();
          this.showToast('Berhasil simpan password');
          this.isReadOnly = true;
        },
        (err) => {
          loading.dismiss();
          this.showToast(err.error.msg);
        }
      );

    setTimeout(() => {}, 4000);
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
