import { ObjKeyStr, ValidationSet } from '@interfaces/global.interfaces';
import { KeyStr } from './../../../../shared/interfaces/global.interfaces';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { OrganizationManagementService } from './../../service/organization-management.service';
import { EditBaseClass } from '@classes/edit-base.class';
import { makeLoadList } from '@sharedMod/methods/makeLoadList';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-process-information',
  templateUrl: './add-process-information.component.html',
  styleUrls: ['./add-process-information.component.scss']

})


export class AddProcessInformationComponent extends EditBaseClass implements OnInit {


  public pageTitle = 'ثبت اطلاعات فرآیند ';
  public override dataSourceObjectSet: KeyStr = {};
  public editMode: boolean = false;
  public override validationSet: ValidationSet[] = [];
  public override comboLoadList: KeyStr[] = [];
  public override modelSet: ObjKeyStr = {};


  constructor(
    public override service: OrganizationManagementService,
    fb: FormBuilder,
    private route: ActivatedRoute,
    location: Location

  ) {
    super(fb)
  }

  public statusList: Array<string> = [];


  override async ngOnInit() {
    super.ngOnInit();

    this.grabage.add(
      this.route.data.subscribe(async (res) => {
        console.log('result Data:', res);
        const data = res['initData'];
        const id = this.route.snapshot.paramMap.get('id');
        this.validationSet = data.validation;
        this.setEditFormValidations();

        this.initForm();
        this.populateValidation(this.FormCtrls);
        this.comboLoadList = makeLoadList(data.load);

      })
    )

  }

  override initForm: any = () => {
    this.form = this.fb.group({
      tblWfp_WorkFlows: this.fb.group({
        Model: [this.modelSet['Name']],
        Name: [''],
        ApiKey: [''],
        Code: [''],
        Description: [''],
        RecordStatus: ['Inserted'],
        KeyId: [null],

      }),
      tblWfp_WorkFlows_Properties: this.fb.group({
        SystemMenu: this.fb.group({
          Model: [this.modelSet['SystemMenu']],
          SystemMenu: [''],
          RecordStatus: ['Inserted'],
          Command: [''],
          KeyId: [null],
        }),
        WorkFlowType: this.fb.group({
          Model: [this.modelSet['WorkFlowType']],
          WorkFlowType: [''],
          RecordStatus: ['Inserted'],
          Command: [''],
          KeyId: [null],
        }),
        SystemIcon: this.fb.group({
          Model: [this.modelSet['SystemIcon']],
          SystemIcon: [''],
          RecordStatus: ['Inserted'],
          Command: [''],
          KeyId: [null],
        }),
      }),
    });
  };

  send() {
    const formVal = this.form.value;
    if (this.form.value) {
      debugger;
      let contractData = this.makeContractData(formVal);
      contractData = [...contractData, ...this.recordStatusSet];
      const actionType = this.wpId ? 'UpdateN' : 'Insertn';
      const param = {
        Data: contractData,
        ActionType: actionType,
      };
      this.grabage.add(
        this.service.add(param).subscribe((res) => {
          console.log(res);
          this.location?.back();

        })
      )
    }
  }

  //*************** GET Control */ 
  get tblWfp_WorkFlows() {
    return this.form.get('tblWfp_WorkFlows') as FormGroup;
  }

  get Name() {
    return this.tblWfp_WorkFlows.get('Name');
  }
  get ApiKey() {
    return this.tblWfp_WorkFlows.get('ApiKey');
  }
  get Code() {
    return this.tblWfp_WorkFlows.get('Code');
  }

  get tblWfp_WorkFlows_Properties() {
    return this.form.get('tblWfp_WorkFlows_Properties') as FormGroup;
  }

  get SystemMenu() {
    return this.tblWfp_WorkFlows_Properties.get('SystemMenu');
  }
  get WorkFlowType() {
    return this.tblWfp_WorkFlows_Properties.get('WorkFlowType');
  }
  get SystemIcon() {
    return this.tblWfp_WorkFlows_Properties.get('SystemIcon');
  }
  get ProductStatus() {
    return this.tblWfp_WorkFlows_Properties.get('RecordStatus')?.value;
  }
  // *************** GetRecordStatus
  get SystemIconStatus() {
    return this.SystemIcon?.get('SystemIconStatus')?.value;

  }
  get SystemMenuStatus() {
    return this.SystemMenu?.get('SystemMenuStatus')?.value;

  }
  get WorkFlowTypeStatus() {
    return this.WorkFlowType?.get('WorkFlowTypeStatus')?.value;

  }
}
