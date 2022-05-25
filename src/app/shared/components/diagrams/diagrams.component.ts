// import { BpmnJS } from 'bpmn-js/lib/NavigatedViewer.js';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, from } from 'rxjs';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

import * as svg from 'save-svg-as-png';

import { HumanActivityComponent } from 'src/app/modules/show-diagrams/human-activity/human-activity.component';

import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
// import * from 'bpmn-js/lib/bpmn-modeler.production.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DiagramsComponent implements OnChanges, OnDestroy, OnInit {


  private bpmnJS: BpmnJS;

  @ViewChild('ref', { static: true }) private el!: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  @Input() public file!: string;

  constructor(private http: HttpClient, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.bpmnJS = new BpmnJS({
      propertiesPanel: {
        parent: '#properties',
      },
      additionalModules: [
        // propertiesPanelModule,
        //        customControlsModule,
        //       customPropertiesProviderModule
      ],
      moddleExtensions: {
        //       camunda: camundaModdleDescriptor,
        //       custom: customModdleDescriptor
      },
    });


    this.bpmnJS.on('import.done', ({ error }: { error: any }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });

    this.bpmnJS.attachTo(this.el.nativeElement);
    this.loadDiagram(this.file);


    var eventBus = this.bpmnJS.get("eventBus");
    eventBus.on("element.click", (event) => {
      console.log(event);
      switch (event.element.type) {
        case 'bpmn:StartEvent':
          this.dialogShape()
          break;
        case "bpmn:Flow_0mn2z98_di":

        case "bpmn:Terminate End Event":
        default:
          break;
      }

    });


  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes['file']) {
      this.loadDiagram(changes['file'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  loadDiagram(file: string): Subscription {
    return this.http
      .get('./assets/diagram/test.bpmn', { responseType: 'text' })
      .pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map((result) => result.warnings)
      )
      .subscribe(
        (warnings: any) => {
          this.importDone.emit({
            type: 'success',
            warnings,
          });
        },
        (err: any) => {
          this.importDone.emit({
            type: 'error',
            error: err,
          });
        }
      );
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(
      this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>
    );
  }

  getBpmnContent(): Promise<void> {
    return this.bpmnJS.saveXML({ format: true });
  }
  async getBpmnSVG() {
    var svgCode =await this.bpmnJS.saveSVG({ format: true }, function (error, svg) {
      if (error) {
          return;
      }
      var svgBlob = new Blob([svg], {
          type: 'image/svg+xml'
      });
      var fileName = 'sdasdasds.svg';
      var downloadLink = document.createElement('a');
      downloadLink.download = fileName;
      downloadLink.innerHTML = 'Get BPMN SVG';
      downloadLink.href = window.URL.createObjectURL(svgBlob);
      downloadLink.click();
      downloadLink.style.visibility = 'hidden';
      document.body.appendChild(downloadLink);
      downloadLink.click();                                        
    });
   
  }

  dialogShape() {
    this.dialog.open(HumanActivityComponent, {
    })
  }

}