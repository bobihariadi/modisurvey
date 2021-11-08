import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  PopoverController,
} from '@ionic/angular';
import { timer } from 'rxjs';
import { PopdalamruteComponent } from 'src/app/components/popdalamrute/popdalamrute.component';

@Component({
  selector: 'app-dalamrute',
  templateUrl: './dalamrute.page.html',
  styleUrls: ['./dalamrute.page.scss'],
})
export class DalamrutePage implements OnInit {
  fakeList: Array<any> = new Array(1);
  showList: boolean = false;
  arrList: any = new Array(1);
  searchTerm: string = '';
  page: number = 0;
  errGps: number = 0;

  constructor(
    private popoverCtrl: PopoverController,
    private router: Router,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    timer(1000).subscribe(() => (this.showList = true));
  }

  async refreshData(event) {
    event.target.complete();
    this.arrList = new Array(1);
  }

  setFilteredItems(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.page = 0;
    this.getData();
  }

  getData() {
    this.showList = false;
    timer(500).subscribe(() => (this.showList = true));
  }

  cleared(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.page = 0;
    this.getData();
  }

  async btnPopover(ev: any) {
    let popover = await this.popoverCtrl.create({
      component: PopdalamruteComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        errGps: this.errGps,
      },
    });

    popover.onDidDismiss().then((r) => {
      if (r.data) {
        this.errGps = r.data.errGpsReturn;
        if (this.errGps > 2) {
          this.goNext();
        }
      }
    });

    await popover.present();
  }

  async goNext() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message:
        'Validasi kunjungan dengan GPS gagal. Apakah ingin melanjutkan kunjungan tanpa validasi kunjungan?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {},
        },
        {
          text: 'Ya',
          handler: async () => {
            this.showActionsheet();
          },
        },
      ],
    });

    await alert.present();
  }

  async showActionsheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Alasan',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Gagal karena GPS error',
          role: 'destructive',
          icon: 'navigate-circle-outline',
          handler: () => {
            this.errGps = 0;
            this.router.navigateByUrl('listmenu');
          },
        },
        {
          text: 'Gagal karena dalam gedung',
          role: 'destructive',
          icon: 'business-outline',
          handler: () => {
            this.errGps = 0;
            this.router.navigateByUrl('listmenu');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
