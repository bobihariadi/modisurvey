import { AlertController, NavParams, PopoverController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-popdalamrute',
  templateUrl: './popdalamrute.component.html',
  styleUrls: ['./popdalamrute.component.scss'],
})
export class PopdalamruteComponent implements OnInit {
  lat: any
  long: any
  errGps: number= 0

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private geoCtrl: Geolocation,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.errGps = this.navParams.get('errGps');
  }

  async goToPage(param){
    await this.router.navigateByUrl(param);
  }

  async DismissClick() {
    let datatest = {
      "errGpsReturn" : this.errGps
    }
    await this.popoverCtrl.dismiss(datatest);
  }

  async confimData(param) {
    this.lat = -6.3049345
    this.long = 106.7105065

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: 'Mulai kunjungan?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
          }
        }, {
          text: 'Ya',
          handler: async () => {
            await this.getLocation()            
            // timer(2000).subscribe(()=> this.router.navigateByUrl('listmenu') )
            
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  async showTost(param, duration=1000) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: duration,
      position: "bottom"
    });
    toast.present();
  }

   async getLocation(){      
        await this.geoCtrl.getCurrentPosition().then(async (resp:any)=>{
          
        const ceklat:any = await resp.coords.latitude
        const ceklong:any =await resp.coords.longitude
 
        let jarak: any = await this.getDistanceFromLatLonInKm(this.lat, this.long, ceklat, ceklong)
        
        jarak = Math.round(jarak)
        
        if(Number(jarak) > 100){
          this.errGps = this.errGps + 1
          // console.log(this.errGps)
          await this.showTost('Posisi outlet tidak sesuai, jarak anda '+ jarak + ' meter dari outlet',2000)
        }else{
          await this.showTost('Jarak anda '+ jarak + ' meter dari outlet',2000)
          this.goToPage('listmenu')
        }
        this.DismissClick() 
      }).catch((error) =>{
        this.showTost('Error getting location: '+error)
      })     
  }

  async getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = await this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = await this.deg2rad(lon2-lon1); 
    var a = await   
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = await 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = await R * c; // Distance in km
    return d*1000; //Distance in Meters
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

 

}
