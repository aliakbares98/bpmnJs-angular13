
import { Component, OnInit, ViewChild } from '@angular/core';
import { DiagramsComponent } from '@shared/diagrams/diagrams.component';


// **********  BPMN IMPORT
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-show-diagrams',
  templateUrl: './show-diagrams.component.html',
  styleUrls: ['./show-diagrams.component.scss']
})
export class ShowDiagramsComponent implements OnInit {


  constructor() { }

  ngOnInit() { }

  bpmnSvg = new BpmnJS;
  diagramFile = 'default.bpmn';
  importError?: Error;


  @ViewChild(DiagramsComponent) diagramComponent!: DiagramsComponent;

  loadWorkflow(workflowFile: string): void {
    this.diagramFile = workflowFile;
  }

  clearEditor(): void {
    this.diagramFile = 'default.bpmn';
  }

  handleImported(event: any) {
    const { type, error, warnings } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

  async saveWorkFlow(): Promise<void> {
    try {
      let bpmnContent: any = await this.diagramComponent.getBpmnContent();
      console.log(bpmnContent.xml);
    } catch (err) {
    }
  }

  async saveSVG(e) {
    let bpmnContent: any = await this.diagramComponent.getBpmnSVG();
    await this.bpmnSvg.saveSVG((err: any, svg: any) => {
      const blob = new Blob([svg], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(blob, './assets/diagram/test.bpmn');
    });

  }

}


