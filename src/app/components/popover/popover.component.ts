import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  
  constructor(
    private router: Router,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  async goToPage(param){
    await this.router.navigate([param], { replaceUrl: true });
  }

  async DismissClick() {
    await this.popoverCtrl.dismiss();
  }

}
