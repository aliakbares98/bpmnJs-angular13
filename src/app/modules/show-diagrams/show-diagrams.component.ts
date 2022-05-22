
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HumanActivityComponent } from './human-activity/human-activity.component';

import BpmnJS from 'bpmn-js/lib/Modeler.js';

@Component({
  selector: 'app-show-diagrams',
  templateUrl: './show-diagrams.component.html',
  styleUrls: ['./show-diagrams.component.scss']
})
export class ShowDiagramsComponent implements OnInit {


  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit() {


  }



  public xmlItems: any;

  //store xml data into array variable

  bpmnJS = new BpmnJS();
  title = 'bpmn-js-angular';


  diagramUrl = './assets/diagram/defautl.bpmn';
  // diagramUrl = './assets/xml/diagram.xml';

  importError?: Error;

  handleImported(event) {
    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }
  gotDialog() {
    this.dialog.open(HumanActivityComponent)
  }
  savexml() {
    // this.bpmnJS.saveXML((err, data) => {
      //   console.log(data);
      // });
      debugger;
      this.bpmnJS.saveXML({ format: true }, function (err, xml) {
      console.log(err, xml);
    });
  }



 
  json: any;
  
  exportJson() {
  
  }

  load(): void {
    //  const modeler = new BpmnJS();
    // try {
    //   const result =  modeler.saveXML();
    //   const { xml } = result;
    //   console.log(xml);
    // } catch (err) {
    //   console.log(err);
    // }

    // this.bpmnJS.saveXML((err: any, xml: any) => {
    //   console.log(this.bpmnJS);

    //   if (err) {
    //     console.log(Error, err);
    //   } else {
    //     console.log('Result of saving XML: ', xml);
    //   }
    // })
    // this.http.get(this.diagramUrl, {
    //   headers: { obsesrve: 'response' }, responseType: 'text'
    // }).subscribe({
    //   next: (x: any) => {
    //     console.log('Fetched XML, now importing: ', x);
    //     // this.bpmnJS.importXML(x, this.handleError);
    //     // try {
    //     //   const result = await this.bpmnJS.importXML(xml);
    //     //   const { warnings } = result;
    //     //   console.log(warnings);
    //     // } catch (err) {
    //     //   console.log(err.message, err.warnings);
    //     // }
    //   },
    // });
  }


  // save(): void {

  //   this.bpmnJS.saveXML((err: any, xml: any) => console.log('Result of saving XML: ', err, xml));
  // }

  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }
}
