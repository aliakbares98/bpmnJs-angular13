import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void { }
  gotodiagram() {
    this.router.navigate[('dashboard/diagram')]
    ;
  }
}
