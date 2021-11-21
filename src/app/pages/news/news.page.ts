import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  fakeList: Array<any> = new Array(7);
  showList: boolean = false;
  arrList: any = []; // any = new Array(7)
  subscription: any;
  serverAddress: string;
  token: string;

  searchTerm: string = '';
  page: number = 0;
  limit: number = 5;

  constructor(
    private router: Router,
    private platform: Platform,
    private http: HttpClient,
    private storageCtrl: Storage,
    public database: DatabaseService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        // timer(500).subscribe(() => (this.showList = true));
        await this.database.createDatabase();
        await this.storageCtrl.create();

        await this.storageCtrl.get('token').then(async (data) => {
          this.token = data;
        });
        await this.getData();
      }
    });
    // timer(1500).subscribe(()=> this.showList = true);
  }

  async refreshData(event) {
    this.page = 0;
    this.showList = false;
    this.searchTerm = '';
    event.target.disabled = false;
    this.arrList = [];
    this.getData(event);
    event.target.complete();
    event.target.disabled = false;

    // timer(1000).subscribe(() => (this.showList = true));
  }

  async getData(event?) {
    // this.bacaItem('news');
    this.showList = false;
    await this.storageCtrl.get('sAddress').then(async (val) => {
      if (val) {
        this.serverAddress = val;
      }
    });
    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Bearer ' + this.token);

    // const params = new HttpParams().set('announce_type', 'areas');

    this.http
      .get(`${this.serverAddress}` + 'announcements', {
        headers: headers,
        // params: params,
        observe: 'response',
      })
      .subscribe(
        async (data: any) => {
          data.body.announcements.forEach((el) => {
            let itemData = {
              id: el.id,
              name: el.name,
              news_date: el.date_start,
              date_end: el.date_end,
              desc: el.description,
              is_hot_news: el.is_hot_news,
            };

            this.arrList.push(itemData);
          });
          for (var i = 0; i < this.arrList.length; i++) {
            let params = {
              table: 'news',
              field: 'id,name,date_start,date_end,description,is_hot_news',
              value: `'${this.arrList[i].id}','${this.arrList[i].name}','${this.arrList[i].news_date}','${this.arrList[i].date_end}','${this.arrList[i].desc}','${this.arrList[i].is_hot_news}'`,
            };
            await this.insertData(params);
          }

          this.showList = true;
        },
        (err) => {
          this.showToast(err.error.msg);
        }
      );
  }

  async insertData(params: any) {
    return new Promise((resolve) => {
      this.database._addData(params).then((data) => {
        // console.log(data);
        resolve(data);
      });
    });
  }

  async deleteData(params: any) {
    return new Promise((resolve) => {
      this.database._deleteData(params).then((data) => {
        resolve(data);
      });
    });
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if (window.location.pathname == '/tabs/tabs/news') {
        this.router.navigate(['tabs/tabs/home'], { replaceUrl: true });
      }
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
}
