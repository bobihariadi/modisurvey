import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { timer } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  fakeList: Array<any> = new Array(7)
  showList: boolean = false;
  arrList: any = new Array(7)
  subscription: any

  searchTerm: string = ""
  page: number = 0
  limit: number = 5

  constructor(
    private router: Router,
    private platform: Platform
  ) { }

  ngOnInit() {
    timer(1500).subscribe(()=> this.showList = true);
  }

  async refreshData(event) {
    // this.page = 0;
    this.showList = false;
    // this.searchTerm = '';
    // event.target.disabled = false;
    // this.getData(event);
    event.target.complete();
    this.arrList = new Array(7)
    // event.target.disabled = false;

    timer(1000).subscribe(()=> this.showList = true);
  }

  setFilteredItems(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.page = 0;
    this.getData();
  }

  getData(){
    this.showList = false
    timer(500).subscribe(()=> this.showList = true);
  }

  cleared(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.page = 0;
    this.getData();
  }

  async loadData(event) {
    this.page = this.page + this.limit;
    await timer(1000).subscribe(()=> this.moreData(event)) 
    // if (this.page >= this.totalRow) {
    //   event.target.disabled = true;
    // }
  }

  moreData(event?) {
    let arr:any = new Array(3)
    // this.arrList.push(arr);
    this.arrList = this.arrList.concat(arr)
    event.target.complete();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if(window.location.pathname == "/tabs/tabs/news"){
        this.router.navigate(['tabs/tabs/home'], { replaceUrl: true })
      }       
    });
  }

}
