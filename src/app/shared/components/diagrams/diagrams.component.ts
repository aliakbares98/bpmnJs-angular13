import { MatDialog } from '@angular/material/dialog';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, from } from 'rxjs';
import { HumanActivityComponent } from 'src/app/modules/show-diagrams/human-activity/human-activity.component';
import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';



import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
// import * as BpmnJS from 'bpmn-js/lib/Modeler.js';


@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DiagramsComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {

  public xmlItems: any;


 bpmnJS: BpmnJS;

  @ViewChild('ref', { static: true }) private el!: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  @Output() addDialog: EventEmitter<any> = new EventEmitter();
  @Input() public url!: string;

  constructor(private http: HttpClient, private dialog: MatDialog,
    private _http: HttpClient) {
  }


  ngOnInit(): void {

    this.bpmnJS = new BpmnJS();



    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });

 

    // ensure the dependency names are still available after minification

    var eventBus = this.bpmnJS.get("eventBus");
    eventBus.on("element.click", (event) => {
      console.log(event);

      switch (event.element.type) {
        case 'bpmn:StartEvent':
          break;
        case 'bpmn:UserTask':
          this.dialogEndEvent();
          break;
        case 'bpmn:EndEvent':
          console.log('endEvent');
          break;
        case 'bpmn:ExclusiveGateway':
          this.dialogExclusiveGateway();
          break;
        case 'bpmn:StartEvent':
          this.dialogStartEvent();
          break;
        case 'bpmn:IntermediateCatchEvent':
          this.dialogIntermediateCatchEvent();
          break;
        case 'bpmn:ManualTask':
          this.dialogManualTask();
          break;
        case 'bpmn:SequenceFlow':
          this.dialogSequenceFlow();
      }
    });
  }

  dialogShape() {
    this.dialog.open(HumanActivityComponent, {
    })
  }

  dialogEndEvent() {

  }

  dialogExclusiveGateway() {

  }

  dialogEnd() {

  }

  dialogStartEvent() {

  }

  dialogIntermediateCatchEvent() {

  }

  dialogManualTask() {

  }

  dialogSequenceFlow() {

  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes['url']) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {
    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }


  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }

  getJSON() {

  }




}
