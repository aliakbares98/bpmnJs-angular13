import { Component, OnInit } from '@angular/core';
import {
  EmitEvent,
  EventBusService,
  Events,
} from 'src/app/core/services/event-bus.service';

@Component({
  selector: 'app-edit-pen',
  templateUrl: './edit-pen.component.html',
  styleUrls: ['./edit-pen.component.scss'],
})
export class EditPenComponent implements OnInit {
  private editMode = false;
  constructor(private eventbus: EventBusService) {}

  ngOnInit(): void {}

  setEditMode() {
    this.editMode = !this.editMode;
    this.eventbus.emit(new EmitEvent(Events.EditPen, this.editMode));
  }
}
