import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Observable, from } from 'rxjs';
import { HumanActivityComponent } from './../../../modules/show-diagrams/human-activity/human-activity.component';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';




import customTranslate from './fn-translate.js';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';

// Validation
import lintModule from 'bpmn-js-bpmnlint';
import bpmnlintConfig from './bpmnlintconfig-packed.js';


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

  constructor(
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit(): void {

    this.bpmnJS = new BpmnJS({
      propertiesPanel: {
        parent: '#properties',
      },
      keyboard: {
        bindTo: document
      },
      linting: {
        bpmnlint: bpmnlintConfig,
        active: true
      },
      additionalModules: [
        lintModule,

        { translate: ['value', customTranslate] },
      ],
      enableZeebeUserTasks: true,
   

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
      switch (event.element.type) {
        case 'bpmn:StartEvent':
          // this.dialogShape()
          break;
        case "bpmn:Flow_0mn2z98_di":

        case "bpmn:Terminate End Event":
        default:
          break;
      }
    });

  }

  removeShape(shape, hints) {
    var context = {
      shape: shape,
      hints: hints || {}
    }
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
      .get('./assets/diagram/defautl.bpmn', { responseType: 'text' })
      .pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map((result) => result.warnings)
      )
      .subscribe({
        next: (warnings: any) => {
          this.importDone.emit({
            type: 'success',
            warnings,
          });
          (err: any) => {
            this.importDone.emit({
              type: 'error',
              error: err,
            });
          }
        }
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
  

  }

  dialogShape() {
    this.dialog.open(HumanActivityComponent, {
    })
  }

}