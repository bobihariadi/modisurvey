import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-visibility',
  templateUrl: './visibility.page.html',
  styleUrls: ['./visibility.page.scss'],
})
export class VisibilityPage implements OnInit {
  fakeList: Array<any> = new Array(5);
  showList: boolean = false;
  arrList: any = new Array(
    { item: 'Foto depan Outlet', isDisabled: false },
    { item: 'Before: Foto Selai', isDisabled: false },
    { item: 'After: Foto Selai', isDisabled: false },
    { item: 'Before: Foto Candy', isDisabled: false },
    { item: 'After: Foto Candy', isDisabled: false },
    { item: 'Foto Produk Rusak', isDisabled: false },
    { item: 'Foto Perubahan Harga', isDisabled: false },
    { item: 'Foto Promo', isDisabled: true },
    { item: 'Foto COC', isDisabled: false },
    { item: 'Foto Stock Komputer', isDisabled: false }
  );
  idOutlet: string;

  constructor(
    private router: Router,
    private alerCtrl: AlertController,
    private toastCtrl: ToastController,
    public database: DatabaseService,
    private platform: Platform,
    private storageCtrl: Storage,
    private photoViewer: PhotoViewer
  ) {}

  async ngOnInit() {
    await this.storageCtrl.create();
    this.storageCtrl.get('idOutlet').then((val) => {
      this.idOutlet = val;
    });

    await this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
      }
    });
  }

  async ionViewDidEnter() {
    this.showList = false;
    this.getVisibility();
  }

  async getVisibility() {
    this.storageCtrl.get('token').then(async (data) => {
      console.log(data);
    });
    // await this.bacaItem('visibility');
    await this.bacaItem('tx_photo');
    let groupOutlet = await this.getGroupOutlet(this.idOutlet);
    let where = `where id_outlet='${this.idOutlet}' and group_outlet='${groupOutlet}'`;

    let params = {
      select: 'id_visibility, id_outlet, visibility_desc, have_photo',
      table: 'visibility',
      where: where,
      order: '',
    };

    await this.database._getData(params).then(async (data) => {
      this.arrList = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.arrList.push({
          item: data.rows.item(i).visibility_desc,
          code: data.rows.item(i).id_visibility,
          have_photo: data.rows.item(i).have_photo,
        });
      }
      this.showList = true;
    });
  }

  async getGroupOutlet(idoutlet) {
    return new Promise((resolve) => {
      let params = {
        select: '*',
        table: 'outlet',
        where: 'where id_outlet =' + idoutlet,
        order: '',
      };
      this.database._getData(params).then(async (data) => {
        console.log(data);
        if (data.rows.length > 0) {
          resolve(data.rows.item(0).group_outlet);
        } else {
          resolve('');
        }
      });
    });
  }

  async refreshData(event) {
    this.showList = false;
    await this.getVisibility();
    event.target.complete();
  }

  async goToDetail(idparam, desc) {
    let navExtra: NavigationExtras = {
      state: {
        idParam: idparam,
        descParam: desc,
      },
    };
    await this.router.navigate(['visibility/ambilgambar'], navExtra);
  }

  async confirmData(param) {
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Anda yakin akan menyimpan semua daftar aktivitas data?',
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
            timer(2000).subscribe(() => this.router.navigate(['listmenu']));
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

  async showPlanogram() {
    let where = `where b.id_outlet='${this.idOutlet}'`;

    let params = {
      select: 'a.*',
      table: 'group_outlet a LEFT JOIN outlet b ON a.id=b.group_outlet',
      where: where,
      order: '',
    };

    let image =
      'data:image/jpeg;base64,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';

    await this.database._getData(params).then(async (data) => {
      if (data.rows.item(0).planogram != 'null') {
        image = await data.rows.item(0).planogram;
      }
    });

    this.photoViewer.show(image, 'Planogram', {
      share: false,
    });
  }
}
