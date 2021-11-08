import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSplash = true;
  deviceID: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private router: Router,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // this.statusBar.styleDefault();
      // this.statusBar.hide();
      // this.statusBar.overlaysWebView(true);
      // this.statusBar.backgroundColorByHexString('#008000');
      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.PORTRAIT
        );

        // this.setupPush();
      }

      timer(2000).subscribe(() => (this.showSplash = false));
      () => this.splashScreen.hide();
    });
  }
}
