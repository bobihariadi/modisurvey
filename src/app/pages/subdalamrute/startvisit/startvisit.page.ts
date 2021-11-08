import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { timer } from 'rxjs';

@Component({
  selector: 'app-startvisit',
  templateUrl: './startvisit.page.html',
  styleUrls: ['./startvisit.page.scss'],
})
export class StartvisitPage implements OnInit {
  dateBegin: any = '';
  startDate: any = '';
  jamAwal: string;
  arrDays: any[] = [
    { day: 'Sun', hari: 'Minggu' },
    { day: 'Mon', hari: 'Senin' },
    { day: 'Tue', hari: 'Selasa' },
    { day: 'Wed', hari: 'Rabu' },
    { day: 'Thu', hari: 'Kamis' },
    { day: 'Fri', hari: "Jum'at" },
    { day: 'Sat', hari: 'Sabtu' },
  ];

  constructor(
    private router: Router,
    private alerCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.getData();
  }

  getDay(param) {
    return this.arrDays.find((x) => x.day === param);
  }

  async getData() {
    this.dateBegin = new Date();
    this.startDate = this.dateBegin.toISOString();
    var d = await this.dateBegin;
    var dayName = d.toString().split(' ')[0];
    var hms = d.toString().split(' ')[4];
    let days = await this.getDay(dayName);

    let newDate = new Date(this.startDate.split('T')[0]);

    this.jamAwal =
      days.hari +
      ', ' +
      newDate.getDate() +
      '-' +
      newDate.getMonth() +
      '-' +
      newDate.getFullYear() +
      '  ' +
      hms;
  }

  async refreshData(event) {
    await this.getData();
    event.target.complete();
  }

  myBackButton() {
    this.router.navigateByUrl('listmenu');
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
            timer(2000).subscribe(() => this.router.navigateByUrl('listmenu'));
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
}
