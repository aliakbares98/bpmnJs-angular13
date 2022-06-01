import { EditBaseClass } from '@classes/edit-base.class';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ListClass } from './../../../../shared/classes/list.class';
import { EventBusService } from './../../../../core/services/event-bus.service';
import { OrganizationManagementService } from './../../service/organization-management.service';


@Component({
  selector: 'app-add-process-information',
  templateUrl: './add-process-information.component.html',
  styleUrls: ['./add-process-information.component.scss']

})


export class AddProcessInformationComponent extends EditBaseClass implements OnInit {


  public pageTitle = 'ثبت اطلاعات فرآیند ';

  constructor(
    public override service: OrganizationManagementService,
    fb: FormBuilder
  ) {
    super(fb)
  }

  public statusList: Array<string> = [];


  override async ngOnInit() {
    super.ngOnInit();
  }

  override initForm: any = () => {
    this.form = this.fb.group({
      
    })
   };

  send() {

  }

}
