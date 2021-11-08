import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from 'src/app/services/database.service';
import { BeritaharianPage } from '../modals/beritaharian/beritaharian.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  idUser: any;
  fullName: string;
  token: string;
  serverAddress: string;

  mulai: number = 30;
  capai: number = 50;
  upload: number = 90;
  subscription: any;
  backButtonPressedOnceToExit: boolean = false;
  image: any;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public database: DatabaseService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private storageCtrl: Storage
  ) {}

  async ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        await this.storageCtrl.create();
        this.storageCtrl.get('dataLogin').then(async (data) => {
          this.fullName = data.name;
          this.idUser = data.id;
        });
        this.storageCtrl.get('token').then(async (data) => {
          this.token = data;
        });
      }
    });
  }

  goTo(param) {
    this.router.navigateByUrl(param);
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: BeritaharianPage,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  async getItenary() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Download Itenary?',
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
            await this.getItenaryData(); //ok
            // await this.getOutletCategoryNew(); // ok
            // await this.getVisibility();
            // await this.getSurvey();
          },
        },
      ],
    });

    await alert.present();
  }

  async getVisibility() {
    let arrParam = [
      {
        id_visibility: 'V-001',
        id_outlet: 'JKT-210078',
        visibility_desc: 'Foto Depan Outlet',
      },
      {
        id_visibility: 'V-002',
        id_outlet: 'JKT-210078',
        visibility_desc: 'Before: Foto Selai',
      },
      {
        id_visibility: 'V-003',
        id_outlet: 'JKT-210078',
        visibility_desc: 'After: Foto Selai',
      },
      {
        id_visibility: 'V-004',
        id_outlet: 'JKT-210078',
        visibility_desc: 'Before: Foto Candy',
      },
      {
        id_visibility: 'V-005',
        id_outlet: 'JKT-210078',
        visibility_desc: 'After: Foto Candy',
      },
      {
        id_visibility: 'V-006',
        id_outlet: 'JKT-210078',
        visibility_desc: 'Foto Produk Rusak',
      },
      {
        id_visibility: 'V-007',
        id_outlet: 'JKT-210078',
        visibility_desc: 'Foto Perubahan Harga',
      },
      {
        id_visibility: 'V-008',
        id_outlet: 'JKT-210078',
        visibility_desc: 'Foto Promo',
      },
      {
        id_visibility: 'V-009',
        id_outlet: 'JKT-210078',
        visibility_desc: 'Foto COC',
      },
      {
        id_visibility: 'V-010',
        id_outlet: 'JKT-210078',
        visibility_desc: 'Foto Stock Komputer',
      },
    ];

    for (var i = 0; i < arrParam.length; i++) {
      let params = {
        table: 'visibility',
        field: 'id_visibility,id_outlet,visibility_desc',
        value: `'${arrParam[i].id_visibility}','${arrParam[i].id_outlet}','${arrParam[i].visibility_desc}'`,
      };
      await this.insertData(params);
    }
  }

  async getVisibilityNew(idOutlet, groupOutlet) {
    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    const params = new HttpParams().set('outlet_group_id', groupOutlet);

    this.http
      .get(`${this.serverAddress}` + 'visibility_activities', {
        headers: headers,
        params: params,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          const arrParam = [];

          data.body.visibility_activities.forEach((el) => {
            let itemData = {
              id_visibility: el.id,
              id_outlet: idOutlet,
              visibility_desc: el.name,
            };

            arrParam.push(itemData);
          });

          for (var i = 0; i < arrParam.length; i++) {
            let params = {
              table: 'visibility',
              field: 'id_visibility,id_outlet,visibility_desc',
              value: `'${arrParam[i].id_visibility}','${arrParam[i].id_outlet}','${arrParam[i].visibility_desc}'`,
            };
            await this.insertData(params);
          }
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async getSurveyNew(idOutlet, groupOutlet) {
    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    const params = new HttpParams().set('outlet_group_id', groupOutlet);

    this.http
      .get(`${this.serverAddress}` + 'surveys', {
        headers: headers,
        params: params,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          const arrSurvey = [];

          data.body.surveys.forEach((data) => {
            data.survey_questions.forEach((el) => {
              let itemData = {
                id: el.id,
                id_outlet: idOutlet,
                iduser: this.idUser,
                survey_desc: el.question,
              };

              arrSurvey.push(itemData);
            });
          });

          for (var i = 0; i < arrSurvey.length; i++) {
            let params = {
              table: 'tx_survey',
              field: 'id,id_outlet,id_user,survey_desc',
              value: `'${arrSurvey[i].id}','${arrSurvey[i].id_outlet}','${arrSurvey[i].iduser}','${arrSurvey[i].survey_desc}'`,
            };
            await this.insertData(params);
          }
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async getDataBasedOnGroupOutlet() {
    let params = {
      select: '*',
      table: 'itenary',
      where: '',
      order: '',
    };
    this.database._getData(params).then(async (data) => {
      const arrData = [];
      for (var i = 0; i < data.rows.length; i++) {
        arrData.push(data.rows.item(i));
        this.getOutletCategoryNew(
          data.rows.item(i).id,
          data.rows.item(i).group_outlet
        );

        this.getVisibilityNew(
          data.rows.item(i).id,
          data.rows.item(i).group_outlet
        );

        this.getSurveyNew(data.rows.item(i).id, data.rows.item(i).group_outlet);
      }
      console.log(arrData);
      setTimeout(async () => {
        await this.bacaItem('tx_category');
        await this.bacaItem('visibility');
        await this.bacaItem('tx_survey');
      }, 4000);
    });
  }

  async getOutletCategoryNew(idOutlet, groupOutlet) {
    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    const params = new HttpParams().set('outlet_group_id', groupOutlet);

    this.http
      .get(`${this.serverAddress}` + 'outlet_group_item_categories', {
        headers: headers,
        params: params,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          const arrOutletCategory = [];

          data.body.outlet_group_item_categories.forEach((el) => {
            let itemData = {
              id_outlet: idOutlet,
              category_id: el.item_category.id,
              category_desc: el.item_category.name,
              max_item: el.outlet_group.maximum_stock,
            };

            arrOutletCategory.push(itemData);
          });

          for (var i = 0; i < arrOutletCategory.length; i++) {
            let params = {
              table: 'tx_category',
              field: 'id_outlet,category_id,category_desc,max_item',
              value: `'${arrOutletCategory[i].id_outlet}','${arrOutletCategory[i].category_id}','${arrOutletCategory[i].category_desc}','${arrOutletCategory[i].max_item}'`,
            };
            await this.insertData(params);
          }
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async getOutletCategory() {
    let arrOutletCategory = [
      { id_outlet: 'JKT-210078', category_id: 'SL001', category_desc: 'SELAI' },
      { id_outlet: 'JKT-210078', category_id: 'SL002', category_desc: 'CANDY' },
      {
        id_outlet: 'JKT-210078',
        category_id: 'SL003',
        category_desc: 'MY BUDDY',
      },
      { id_outlet: 'JKT-210079', category_id: 'SL001', category_desc: 'SELAI' },
      { id_outlet: 'JKT-210079', category_id: 'SL002', category_desc: 'CANDY' },
      {
        id_outlet: 'JKT-210079',
        category_id: 'SL003',
        category_desc: 'MY BUDDY',
      },
      {
        id_outlet: 'JKT-210023',
        category_id: 'SL001',
        category_desc: 'SELAI',
      },
      {
        id_outlet: 'JKT-210023',
        category_id: 'SL002',
        category_desc: 'CANDY',
      },
      {
        id_outlet: 'JKT-210023',
        category_id: 'SL003',
        category_desc: 'MY BUDDY',
      },
    ];

    for (var i = 0; i < arrOutletCategory.length; i++) {
      let params = {
        table: 'tx_category',
        field: 'id_outlet,category_id,category_desc',
        value: `'${arrOutletCategory[i].id_outlet}','${arrOutletCategory[i].category_id}','${arrOutletCategory[i].category_desc}'`,
      };
      await this.insertData(params);
    }
  }

  async getItenaryData() {
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

    await this.http
      .get(`${this.serverAddress}` + 'visited_outlets', {
        headers: headers,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          const arrOutlet = [];

          data.body.visited_outlets.forEach((el) => {
            let itemData = {
              id_visit: el.id,
              id_outlet: el.outlet.id,
              group_outlet: el.outlet.outlet_group.id,
              iduser: el.schedule_visit.user.id,
              status: '1',
            };

            arrOutlet.push(itemData);
          });

          for (var i = 0; i < arrOutlet.length; i++) {
            let params = {
              table: 'itenary',
              field: 'id,id_outlet,group_outlet,id_user,status',
              value: `${arrOutlet[i].id_outlet},'${arrOutlet[i].id_outlet}','${arrOutlet[i].group_outlet}','${arrOutlet[i].iduser}','${arrOutlet[i].status}'`,
            };
            await this.insertData(params);
          }

          await this.getDataBasedOnGroupOutlet();
          loading.dismiss();
          this.showToast('Berhasil download itenary');
          this.cekItenary();
        },
        (err) => {
          loading.dismiss();
          this.showToast(
            err.status + ' | ' + err.error.msg + '\n' + err.statusText
          );
        }
      );
  }

  async getSurvey() {
    let arrSurvey = [
      { id_outlet: 'JKT-210078', iduser: '123', survey_desc: 'ada TRAY' },
      { id_outlet: 'JKT-210078', iduser: '123', survey_desc: 'ada PAGE HOOK' },
      {
        id_outlet: 'JKT-210078',
        iduser: '123',
        survey_desc: 'ada CLIPSTRIP Twister',
      },
      {
        id_outlet: 'JKT-210078',
        iduser: '123',
        survey_desc: 'ada CLIPSTRIP Mallow Pop',
      },
      { id_outlet: 'JKT-210079', iduser: '123', survey_desc: 'ada TRAY' },
      { id_outlet: 'JKT-210079', iduser: '123', survey_desc: 'ada PAGE HOOK' },
      {
        id_outlet: 'JKT-210079',
        iduser: '123',
        survey_desc: 'ada CLIPSTRIP Twister',
      },
      {
        id_outlet: 'JKT-210079',
        iduser: '123',
        survey_desc: 'ada CLIPSTRIP Mallow Pop',
      },
      { id_outlet: 'JKT-210023', iduser: '123', survey_desc: 'ada TRAY' },
      { id_outlet: 'JKT-210023', iduser: '123', survey_desc: 'ada PAGE HOOK' },
      {
        id_outlet: 'JKT-210023',
        iduser: '123',
        survey_desc: 'ada CLIPSTRIP Twister',
      },
      {
        id_outlet: 'JKT-210023',
        iduser: '123',
        survey_desc: 'ada CLIPSTRIP Mallow Pop',
      },
    ];

    for (var i = 0; i < arrSurvey.length; i++) {
      let params = {
        table: 'tx_survey',
        field: 'id_outlet,id_user,survey_desc',
        value: `'${arrSurvey[i].id_outlet}','${arrSurvey[i].iduser}','${arrSurvey[i].survey_desc}'`,
      };
      await this.insertData(params);
    }
  }

  async cekItenary() {
    let params = {
      select: '*',
      table: 'itenary',
      where: '',
      order: '',
    };
    this.database._getData(params).then(async (data) => {
      if (data.rows.length > 0) {
        await this.showToast('Berhasil download itenary');
        this.presentModal();
      } else {
        await this.showToast('Tidak ada data itenary');
      }

      const arrData = [];
      for (var i = 0; i < data.rows.length; i++) {
        arrData.push(data.rows.item(i));
      }
      // console.log(arrData);
    });

    this.loadingCtrl.dismiss();
  }

  async itemData() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Refresh Item Data?',
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
            // await this.getDataJson();
            // await this.getDataItem();
            await this.getDataItems();
          },
        },
      ],
    });

    await alert.present();
  }

  async getDataItems() {
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

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + jwt,
    //     name: 'aceh',
    //   }),
    // };

    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    // const params = new HttpParams().set('name', 'Aceh');

    this.http
      .get(`${this.serverAddress}` + 'items', {
        headers: headers,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          const arrItem = [];

          data.body.items.forEach((el) => {
            let itemData = {
              code: el.code,
              name_item: el.name,
              image_path: 'assets/shapes.svg',
              status: '1',
              category_id: el.item_category.id,
              caregory_desc: el.item_category.name,
              sub_category_id: el.item_sub_category.id,
              sub_category_desc: el.item_sub_category.name,
              image_blob: el.image,
            };
            arrItem.push(itemData);
          });
          // console.log(arrItem);

          for (var i = 0; i < arrItem.length; i++) {
            let params = {
              table: 'item',
              field:
                'code,name_item,image_path, status, category_id, category_desc, sub_category_id, sub_category_desc, image_blob',
              value: `'${arrItem[i].code}','${arrItem[i].name_item}','${arrItem[i].image_path}','${arrItem[i].status}','${arrItem[i].category_id}','${arrItem[i].caregory_desc}','${arrItem[i].sub_category_id}','${arrItem[i].sub_category_desc}','${arrItem[i].image_blob}'`,
            };
            await this.insertData(params);
          }

          loading.dismiss();
          this.showToast('Berhasil refresh item data');
          // this.bacaItem('item');
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async outletData() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Refresh Outlet Data?',
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
            // await this.getDataOutlet();
            await this.getDataOutlets();
          },
        },
      ],
    });

    await alert.present();
  }

  async getDataOutlets() {
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

    this.http
      .get(`${this.serverAddress}` + 'outlets', {
        headers: headers,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          const arrOutlet = [];
          const arrGroup = [];

          data.body.outlets.forEach((el) => {
            let outletData = {
              id: el.id,
              name: el.name,
              group: el.outlet_group.id,
              groupDesc: el.outlet_group.name,
              address: 'Jl. Angsana Raya No.1',
              kel: el.village.name,
              kec: el.district.name,
              kota: el.city.name,
              kdpos: el.postal_code.code,
              kontak: 'Bobi Hariadi',
              hp: '081374336102',
              lat: el.latitude,
              long: el.longitude,
            };

            let groupData = {
              id: el.outlet_group.id,
              code: el.outlet_group.code,
              name: el.outlet_group.name,
              max_item: el.outlet_group.maximum_stock,
              planogram: el.outlet_group.planogram,
            };

            arrOutlet.push(outletData);
            arrGroup.push(groupData);
          });

          for (var i = 0; i < arrOutlet.length; i++) {
            let params = {
              table: 'outlet',
              field:
                'id_outlet,name_outlet,group_outlet, group_outlet_name, address, kelurahan, kecamatan, kota, kdpos, kontak,hp, lat, long',
              value: `'${arrOutlet[i].id}','${arrOutlet[i].name}','${arrOutlet[i].group}','${arrOutlet[i].groupDesc}','${arrOutlet[i].address}','${arrOutlet[i].kel}', '${arrOutlet[i].kec}', '${arrOutlet[i].kota}', '${arrOutlet[i].kdpos}','${arrOutlet[i].kontak}','${arrOutlet[i].hp}', '${arrOutlet[i].lat}', '${arrOutlet[i].long}' `,
            };
            await this.insertData(params);
          }

          for (var i = 0; i < arrGroup.length; i++) {
            let paramsGroup = {
              table: 'group_outlet',
              field: 'id,code,name,max_item, planogram',
              value: `'${arrGroup[i].id}','${arrGroup[i].code}','${arrGroup[i].name}','${arrGroup[i].max_item}','${arrGroup[i].planogram}'`,
            };
            await this.insertData(paramsGroup);
          }

          loading.dismiss();
          this.showToast('Berhasil refresh item data');
          // this.bacaItem('outlet');
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async getDataOutlet() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon tunggu...',
    });
    await loading.present();

    let arrOutlet = [
      {
        id: 'JKT-210078',
        name: 'TOKO-001',
        address: 'Jl. Angsana Raya No.1',
        kel: 'Jombang',
        kec: 'Ciputat',
        kota: 'Tangerang Selatan',
        kdpos: '15414',
        kontak: 'Bobi Hariadi',
        hp: '081374336102',
        lat: '-6.299049914822786',
        long: '106.7144919836507',
      },
      {
        id: 'JKT-210079',
        name: 'TOKO-002',
        address: 'Jl. Damai Raya No.5',
        kel: 'Jombang',
        kec: 'Ciputat',
        kota: 'Tangerang Selatan',
        kdpos: '15414',
        kontak: 'Bobi Hariadi',
        hp: '081374336102',
        lat: '-6.3065147057240765',
        long: '106.72415866555859',
      },
      {
        id: 'JKT-210028',
        name: 'TOKO-003',
        address: 'Jl. Kemuning Raya No.28',
        kel: 'Jombang',
        kec: 'Ciputat',
        kota: 'Tangerang Selatan',
        kdpos: '15414',
        kontak: 'Bobi Hariadi',
        hp: '081374336102',
        lat: '123',
        long: '222',
      },
      {
        id: 'JKT-210023',
        name: 'TOKO-004',
        address: 'Jl. Nimun Raya No.13',
        kel: 'Jombang',
        kec: 'Ciputat',
        kota: 'Tangerang Selatan',
        kdpos: '15414',
        kontak: 'Bobi Hariadi',
        hp: '081374336102',
        lat: '-6.298196792012331',
        long: '106.73364292428757',
      },
      {
        id: 'JKT-210030',
        name: 'TOKO-005',
        address: 'Jl. Ciputat Raya No.8',
        kel: 'Jombang',
        kec: 'Ciputat',
        kota: 'Tangerang Selatan',
        kdpos: '15414',
        kontak: 'Bobi Hariadi',
        hp: '081374336102',
        lat: '123',
        long: '222',
      },
    ];

    for (var i = 0; i < arrOutlet.length; i++) {
      let params = {
        table: 'outlet',
        field:
          'id_outlet,name_outlet,address, kelurahan, kecamatan, kota, kdpos, kontak,hp, lat, long',
        value: `'${arrOutlet[i].id}','${arrOutlet[i].name}','${arrOutlet[i].address}','${arrOutlet[i].kel}', '${arrOutlet[i].kec}', '${arrOutlet[i].kota}', '${arrOutlet[i].kdpos}','${arrOutlet[i].kontak}','${arrOutlet[i].hp}', '${arrOutlet[i].lat}', '${arrOutlet[i].long}' `,
      };
      await this.insertData(params);
    }

    loading.dismiss();
    this.showToast('Berhasil refresh outlet data');
    this.bacaOutlet();
  }

  async getDataJson() {
    this.http.get('assets/data/image.json').subscribe(
      (res: any) => {
        this.image = res.image;
      },
      (err) => {
        console.log('err: ' + err);
      }
    );
  }

  async getDataItem() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon tunggu...',
    });
    await loading.present();

    let arrItem = [
      {
        code: 'BRG-1',
        name_item: 'Budy Jum Cup Pindekas',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL001',
        caregory_desc: 'SELAI',
        sub_category_id: 'SL001001',
        sub_category_desc: 'BUDY JUM CUP',
        image_blob: this.image[0].url_img,
      },
      {
        code: 'BRG-2',
        name_item: 'Budy Jum Tube Chocolate',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL001',
        caregory_desc: 'SELAI',
        sub_category_id: 'SL001002',
        sub_category_desc: 'BUDY JUM TUBE',
        image_blob: this.image[1].url_img,
      },
      {
        code: 'BRG-3',
        name_item: 'Budy Jum Pouch Strawberry',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL001',
        caregory_desc: 'SELAI',
        sub_category_id: 'SL001003',
        sub_category_desc: 'BUDY JUM POUCH',
        image_blob: this.image[2].url_img,
      },
      {
        code: 'BRG-4',
        name_item: 'Cars Mallow',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL002',
        caregory_desc: 'CANDY',
        sub_category_id: 'SL002001',
        sub_category_desc: 'CARS MALLOW',
        image_blob: this.image[3].url_img,
      },
      {
        code: 'BRG-5',
        name_item: 'Duckies Mallow',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL002',
        caregory_desc: 'CANDY',
        sub_category_id: 'SL002002',
        sub_category_desc: 'DUCKIES MALLOW',
        image_blob: this.image[4].url_img,
      },
      {
        code: 'BRG-6',
        name_item: 'Stars Mallow',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL002',
        caregory_desc: 'CANDY',
        sub_category_id: 'SL002003',
        sub_category_desc: 'STARS MALLOW',
        image_blob: this.image[5].url_img,
      },
      {
        code: 'BRG-7',
        name_item: 'MB-317A',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL003',
        caregory_desc: 'MY BUDDY',
        sub_category_id: 'SL003001',
        sub_category_desc: 'MB-317A',
        image_blob: this.image[6].url_img,
      },
      {
        code: 'BRG-8',
        name_item: 'MB-317B',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL003',
        caregory_desc: 'MY BUDDY',
        sub_category_id: 'SL003002',
        sub_category_desc: 'MB-317B',
        image_blob: this.image[7].url_img,
      },
      {
        code: 'BRG-9',
        name_item: 'MB-317C',
        image_path: 'assets/shapes.svg',
        status: '1',
        category_id: 'SL003',
        caregory_desc: 'MY BUDDY',
        sub_category_id: 'SL003003',
        sub_category_desc: 'MB-317C',
        image_blob: this.image[8].url_img,
      },
    ];

    for (var i = 0; i < arrItem.length; i++) {
      let params = {
        table: 'item',
        field:
          'code,name_item,image_path, status, category_id, category_desc, sub_category_id, sub_category_desc, image_blob',
        value: `'${arrItem[i].code}','${arrItem[i].name_item}','${arrItem[i].image_path}','${arrItem[i].status}','${arrItem[i].category_id}','${arrItem[i].caregory_desc}','${arrItem[i].sub_category_id}','${arrItem[i].sub_category_desc}','${arrItem[i].image_blob}'`,
      };
      await this.insertData(params);
    }

    loading.dismiss();
    this.showToast('Berhasil refresh item data');
    this.bacaItem('item');
  }

  async insertData(params: any) {
    return new Promise((resolve) => {
      this.database._addData(params).then((data) => {
        // console.log(data);
        resolve(data);
      });
    });
  }

  async bacaOutlet() {
    let params = {
      select: '*',
      table: 'outlet',
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

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if (window.location.pathname == '/tabs/tabs/home') {
        if (this.backButtonPressedOnceToExit) {
          navigator['app'].exitApp();
        } else {
          timer(1000).subscribe(
            () => (this.backButtonPressedOnceToExit = false)
          );
          this.backButtonPressedOnceToExit = true;
          this.showToast('Press back button twice to exit');
        }
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
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

  async clearData() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Clear Data?',
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
            await this.commitClear();
          },
        },
      ],
    });

    await alert.present();
  }

  async commitClear() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon tunggu...',
    });
    await loading.present();

    let arrItem = [
      'itenary',
      'tx_category',
      'tx_stok',
      'visibility',
      'tx_photo',
      'tx_survey',
      // 'item',
      // 'outlet',
      'tx_merchandising',
    ];

    for (var i = 0; i < arrItem.length; i++) {
      let params = {
        table: arrItem[i],
        where: '',
      };
      const status_del = await this.deleteData(params);
      console.log(status_del);
    }

    loading.dismiss();
    this.showToast('Data cleared');
  }

  async deleteData(params: any) {
    return new Promise((resolve) => {
      this.database._deleteData(params).then((data) => {
        resolve(data);
      });
    });
  }
}
