import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.page.html',
  styleUrls: ['./performance.page.scss'],
})
export class PerformancePage implements OnInit {
  bulan: number = 8;
  tahun: number = 2021;

  constructor() {}

  ngOnInit() {}
}
