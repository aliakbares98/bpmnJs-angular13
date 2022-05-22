import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventBusService } from '@core/services/event-bus.service';
import { EmitEvent, Events } from '../services/event-bus.service';

export interface DialogData { }

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  host: {
    '(document:click)': 'close($event)',
  },
})
export class ModalComponent {
  message = 'آیا از حذف این مورد اطمینان دارید؟';
  confirmButtonText = 'تایید';
  cancelButtonText = 'عدم تایید';
  title = 'هشدار';

  constructor(
    private eventbus: EventBusService,
    // @Inject(String) public dialogRef: MatDialogRef<ModalComponent>,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.message = data.message || this.message;
      this.title = data.title || this.title;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  close(event: any) {
    if (this.dialogRef.getState()) {
      this.eventbus.emit(new EmitEvent(Events.BackDrop, false));
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.eventbus.emit(new EmitEvent(Events.BackDrop, false));
  }
  onConfirmClick(): void {
    this.dialogRef.close(true);
    this.eventbus.emit(new EmitEvent(Events.BackDrop, false));
  }
}
