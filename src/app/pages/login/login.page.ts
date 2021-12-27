import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { api_url } from 'src/config';
import { timer } from 'rxjs';
import { Device } from '@ionic-native/device/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword: boolean = false;
  isDisabled: boolean = false;
  userId: string = '';
  password: string = '';
  btnLabel: string = 'Login';
  subscription: any;
  backButtonPressedOnceToExit: boolean = false;
  deviceID: any;
  dataUser: any = [];

  lat: any = '';
  long: any = '';

  serverAddress: string;
  port: string;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private router: Router,
    private storageCtrl: Storage,
    private platform: Platform,
    private device: Device,
    public database: DatabaseService,
    private geoCtrl: Geolocation
  ) {}

  async ngOnInit() {
    await this.storageCtrl.create();
    this.storageCtrl.get('isLogin').then(async (val) => {
      if (val) {
        this.router.navigate(['tabs'], { replaceUrl: true });
      }
    });

    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.storageCtrl.set('sAddress', 'http://128.199.245.1/api/v1/');
        await this.storageCtrl.set('sPort', '8080');
        await this.database.createDatabase();
        await this.getUser();
        await this.getLatLong();
      }
    });
  }

  async showSetting() {
    this.router.navigateByUrl('setting');
  }

  async getLatLong() {
    await this.geoCtrl
      .getCurrentPosition()
      .then(async (resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
      })
      .catch((error) => {
        console.log('Error getting location: ' + error);
      });
  }

  async insertDeviceId() {
    this.database.addUser(this.userId, this.device.uuid).then((data) => {
      setTimeout(() => {
        this.getUser();
      }, 500);
    });
  }

  async getUser() {
    this.dataUser = [];
    let params = {
      select: 'uuid',
      table: 'users',
      where: '',
      order: '',
    };
    this.database._getData(params).then(async (data) => {
      if (data.rows.length <= 0) {
        await this.insertDeviceId();
        //   for (var i = 0; i < data.rows.length; i++) {
        //     this.dataUser.push(data.rows.item(i));
        //   }
      } else {
        this.deviceID = data.rows.item(0).uuid;
      }
    });
  }

  async goLogin() {
    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });

    this.getLatLong();
    if (this.lat == '' || this.lat == null) {
      this.showToast('Login harus mengaktifkan location');
      return false;
    }

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('device-id', this.deviceID);

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'device-id': '123456',
    //     observe: 'response',
    //   }),
    // };

    this.isDisabled = true;
    this.btnLabel = 'Mohon tunggu... ';
    if (!this.userId || !this.password) {
      this.showToast('User ID atau Password harus diisi');
      this.btnLabel = 'Login';
      this.isDisabled = false;
      return false;
    }

    let arrData = {
      username: this.userId,
      password: this.password,
    };

    this.http
      .post(`${this.serverAddress}` + 'sessions', arrData, {
        headers: headers,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          await this.showToast('Success');
          await this.storageCtrl.set('isLogin', true);
          await this.storageCtrl.set('dataLogin', data.body.user);
          await this.storageCtrl.set('token', data.headers.get('token'));

          // console.log(data.headers.get('token'));

          this.router.navigate(['tabs'], { replaceUrl: true });
        },
        (err) => {
          this.showToast(err.status);
          this.btnLabel = 'Login';
          this.isDisabled = false;
          this.showToast(err.error.message);
        }
      );
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

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if (this.backButtonPressedOnceToExit) {
        navigator['app'].exitApp();
      } else {
        timer(1000).subscribe(() => (this.backButtonPressedOnceToExit = false));
        this.backButtonPressedOnceToExit = true;
        this.showToast('Tekan tombol kembali dua kali untuk keluar');
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
