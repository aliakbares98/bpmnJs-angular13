import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient) { }


  ngOnInit() {

    this.http.get('/assets/appConfig.json').subscribe((confing: any) => {
      localStorage.setItem(
        'hermes_endPoints',
        JSON.stringify(confing.endPoints)
      );
    });
  }


}





