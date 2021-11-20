import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CameraPreview,
  CameraPreviewPictureOptions,
  CameraPreviewOptions,
} from '@ionic-native/camera-preview/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-ambilgambar',
  templateUrl: './ambilgambar.page.html',
  styleUrls: ['./ambilgambar.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AmbilgambarPage implements OnInit {
  picture: string = '';
  btnDisabled: boolean = false;
  cameraOpened: boolean = false;
  base64Image: any;
  params: any;
  idOutlet: string;
  isExist: boolean = false;
  width: any;
  idUser: any;

  constructor(
    private cameraPreview: CameraPreview,
    private photoViewer: PhotoViewer,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    public database: DatabaseService,
    private platform: Platform,
    private storageCtrl: Storage,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async () => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.params = this.router.getCurrentNavigation().extras.state;
      }
    });
    // this.activatedRoute.queryParams.subscribe(async (params) => {
    //   if (params && params.state) {
    //     this.params = JSON.parse(params.state);
    //     console.log(this.params);
    //   }
    // });

    this.storageCtrl.create();
    await this.storageCtrl.get('idOutlet').then(async (val) => {
      this.idOutlet = await val;
    });

    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.storageCtrl.get('dataLogin').then(async (data) => {
          this.idUser = data.id;
        });

        await this.database.createDatabase();
        await this.getPhoto();
      }
    });
  }

  async getPhoto() {
    let param = {
      select: 'id, id_visibility, image_blob',
      table: 'tx_photo',
      where: `WHERE id_visibility='${this.params.idParam}' and id_outlet='${this.idOutlet}' and is_sync='N' `,
      order: '',
    };

    await this.database._getData(param).then(async (data) => {
      for (var i = 0; i < data.rows.length; i++) {
        this.picture = 'data:image/jpeg;base64,' + data.rows.item(i).image_blob;
        this.isExist = true;
        return false;
      }
      this.picture = 'assets/img/no_image.jpg';
    });
  }

  takePhoto() {
    this.btnDisabled = true;
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 5,
      y: 60,
      width: Number(window.screen.width) * 0.97,
      height: Number(window.screen.height) * 0.775,
      // width: 350,
      // height: 620,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: false,
      toBack: false,
      alpha: 1,
    };

    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res);
        this.cameraOpened = true;
      },
      (err) => {
        console.log(err);
      }
    );

    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1280,
      height: 1280,
      quality: 85,
    };

    this.cameraPreview.takePicture(pictureOpts).then(
      (imageData) => {
        this.base64Image = imageData;
        this.picture = 'data:image/jpeg;base64,' + imageData;
        this.cameraPreview.stopCamera();
        this.btnDisabled = false;
        this.cameraOpened = false;
      },
      (err) => {
        console.log(err);
        this.picture = 'assets/img/no_image.jpg';
        this.cameraPreview.stopCamera();
        this.btnDisabled = false;
        this.cameraOpened = false;
      }
    );
  }

  async savePhoto() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Simpan Photo?',
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
            await this.commitSave();
            await this.showTost('Data berhasil disimpan');
            timer(2000).subscribe(() => this.router.navigate(['visibility']));
          },
        },
      ],
    });

    await alert.present();
  }

  async commitSave() {
    if (!this.isExist) {
      let params = {
        table: 'tx_photo',
        field: 'id_visibility,id_outlet,id_user,image_blob',
        value: `'${this.params.idParam}','${this.idOutlet}','${this.idUser}','${this.base64Image}'`,
      };
      let result = await this.insertData(params);
      if (result) {
        await this.updateVisibility();
      }
    } else {
      let params = {
        table: 'tx_photo',
        set: `image_blob = '${this.base64Image}' `,
        where: `id_visibility='${this.params.idParam}' and id_outlet='${this.idOutlet}'`,
      };
      let result = await this.updateData(params);
      if (result) {
        await this.updateVisibility();
      }
    }
  }

  async updateVisibility() {
    let params = {
      table: 'visibility',
      set: `have_photo = 'Y' `,
      where: `id_visibility='${this.params.idParam}' and id_outlet='${this.idOutlet}'`,
    };
    await this.updateData(params);
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

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 1000,
      position: 'bottom',
      cssClass: 'myToast',
    });
    toast.present();
  }

  previewPhoto() {
    console.log(this.picture);
    this.photoViewer.show(this.picture, 'Preview', { share: false });
  }

  backButton() {
    if (this.cameraOpened) {
      this.cameraPreview.stopCamera();
    }
  }
}
