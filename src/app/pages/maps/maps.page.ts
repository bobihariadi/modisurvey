import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Map, tileLayer, marker, circle, polyline } from 'leaflet';
import 'leaflet-routing-machine';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { getLocaleDirection } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var L: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map: Map;
  newMarker: any;
  address: string[];
  lat: any;
  long: any;
  arrList: any = [];
  arrLabel: any = [];

  constructor(
    private router: Router,
    private geocoder: NativeGeocoder,
    private platform: Platform,
    public database: DatabaseService,
    private geoCtrl: Geolocation
  ) {}

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        await this.database.createDatabase();
        await this.getLatLong();
        await this.getItenary();
        this.loadMap();
      }
    });
  }

  ionViewDidEnter() {
    // this.loadMap();
  }

  async getItenary() {
    let params = {
      select:
        'a.id, b.name_outlet, b.address, case when a.status= "1" then "Belum dikunjungi" when a.status= "2" then "Sudah dikunjungi" when a.status="3" then "Pending" else "Void" end status, b.lat, b.long',
      table: 'itenary a left join outlet b on a.id_outlet = b.id_outlet',
      where: '',
      order: 'ORDER BY a.id ASC',
    };
    await this.database._getData(params).then(async (data) => {
      this.arrList = [L.latLng(this.lat, this.long)];
      this.arrLabel = ['<div >Your Location</div>'];
      for (var i = 0; i < data.rows.length; i++) {
        let pushData = L.latLng(data.rows.item(i).lat, data.rows.item(i).long);
        this.arrList.push(pushData);
        this.arrLabel.push(
          '<div><h3>' +
            data.rows.item(i).name_outlet +
            '</h3><p>' +
            data.rows.item(i).address +
            '</p></div>'
        );
      }
    });
  }

  async getLatLong() {
    // this.lat = -6.299711086335856;
    // this.long = 106.71485676408797;
    await this.geoCtrl
      .getCurrentPosition()
      .then(async (resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        console.log('lat: ' + this.lat + '\nlong: ' + this.long);
      })
      .catch((error) => {
        console.log('Error getting location: ' + error);
      });
  }

  loadMap() {
    this.map = new Map('mapId').setView([this.lat, this.long], 13);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data © <a    href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-   SA</a>',
    }).addTo(this.map); // This line is added to add the Tile Layer to our map

    // this.locatePosition();

    circle([this.lat, this.long], {
      color: '',
      fillColor: 'green',
      fillOpacity: 0.2,
      radius: 1000,
    }).addTo(this.map);

    // this.getRoute();
    // let waypoin = [
    //   L.latLng(-6.304891278003498, 106.71046649584667),
    //   L.latLng(-6.3065147057240765, 106.72415866555859),
    //   L.latLng(-6.298196792012331, 106.73364292428757),
    //   L.latLng(-6.298090148191922, 106.72539248136721),
    // ];
    let waypoin = this.arrList;
    // let label = [
    //   '<div><p>Your location</p><p>sample</p></div>',
    //   'toko 2',
    //   'toko 3',
    //   'toko 4',
    // ];
    let label = this.arrLabel;

    L.Routing.control({
      waypoints: waypoin,
      lineOptions: {
        styles: [{ color: '#039c24', opacity: 1, weight: 5 }],
      },
      createMarker: function (i: number, waypoint: any, n: number) {
        let icons = 'marker-red.png';
        if (i == 0) {
          icons = 'marker-green.png';
        }
        const marker = L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl: './assets/img/' + icons,
            iconSize: [30, 45],
            iconAnchor: [15, 45],
            popupAnchor: [-3, -76],
          }),
        });
        return marker.bindPopup(label[i]);
      },
      routeWhileDragging: false,
      show: false,
      router: L.Routing.mapbox(
        'pk.eyJ1IjoiYm9iaWhhcmlhZGkiLCJhIjoiY2t0Z3N4b256MGxmMDJ3cnRoangwaTY2eCJ9.hAPHpD6YWD-YRAyZK9gvOQ'
      ),
    }).addTo(this.map);

    // var popup = L.popup()
    //   .setLatLng([-6.304891278003498, 106.71046649584667])
    //   .setContent('I am a standalone popup.')
    //   .openOn(this.map);
  }

  getRoute() {
    var point,
      route,
      points = [];
    // for (var i=0; i<response.route_geometry.length; i++)
    // {
    points.push([-6.304891278003498, 106.71046649584667]);
    points.push([-6.3065147057240765, 106.72415866555859]);
    points.push([-6.298196792012331, 106.73364292428757]);
    // }
    route = polyline(points, {
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1,
      color: 'green',
    }).addTo(this.map);
    route.bringToFront();

    this.map.fitBounds(route.getBounds());
  }

  locatePosition() {
    // this.map.locate({ setView: true }).on('locationfound', (e: any) => {
    // console.log(e);
    this.newMarker = marker([-6.304891278003498, 106.71046649584667], {
      draggable: false,
    }).addTo(this.map);
    this.newMarker.bindPopup('Outlet A').openPopup();
    this.getAddress(-6.304891278003498, 106.71046649584667); // This line is added

    // this.newMarker = marker([-6.303486146293768, 106.72162665945152], {
    //   draggable: false,
    // }).addTo(this.map);
    // this.newMarker.bindPopup('Outlet B').openPopup();
    // this.getAddress(-6.303486146293768, 106.72162665945152); // This line is added

    this.newMarker.on('dragend', () => {
      const position = this.newMarker.getLatLng();
      this.getAddress(position.lat, position.lng); // This line is added
      console.log(position);
    });
    // });
  }

  getAddress(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    this.geocoder.reverseGeocode(lat, long, options).then((results) => {
      // console.log('------------------------------------');
      // console.log(Object.values(results[0]).reverse());
      this.address = Object.values(results[0]).reverse();
    });
  }
}
