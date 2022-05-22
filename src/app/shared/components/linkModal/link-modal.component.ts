import { FormBuilder, } from '@angular/forms';
import { Component, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  EmitEvent,  EventBusService,  Events,} from '@core/services/event-bus.service';



@Component({
  selector: 'app-link-modal',
  templateUrl: './link-modal.component.html',
  styleUrls: ['./link-modal.component.scss'],
  /*   host: {
    '(document:click)': 'close($event)',
  }, */
})
export class LinkModalComponent {
  title!: string;
  controlName!: string;
  confirmButtonText = 'ذخیره';
  cancelButtonText = 'انصراف';
  comboList = [];

  form = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private elRef: ElementRef,
    private eventbus: EventBusService,
    public dialogRef: MatDialogRef<LinkModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.title = data?.title;
      this.controlName = data?.controlName;
      this.comboList = data?.comboLoad;

      this.form.addControl(this.controlName, this.fb.control(data.comboData));
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.eventbus.emit(new EmitEvent(Events.BackDrop, false));
  }
  onConfirmClick(): void {
    this.dialogRef.close(this.form.value);
    this.eventbus.emit(new EmitEvent(Events.BackDrop, false));
  }
}
