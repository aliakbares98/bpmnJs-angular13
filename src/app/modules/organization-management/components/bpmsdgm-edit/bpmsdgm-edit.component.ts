import { ObjKeyStr, ValidationSet } from '@interfaces/global.interfaces';
import { KeyStr } from '../../../../shared/interfaces/global.interfaces';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EditBaseClass } from '@classes/edit-base.class';
import { makeLoadList } from '@sharedMod/methods/makeLoadList';
import { Location } from '@angular/common';
import { BmpsdgmService } from '../../service/bpmsdgm.service';
import { separateGroupValue } from '@methods/seprateGroupValue';


@Component({
  selector: 'app-bpmsdgm-edit',
  templateUrl: './bpmsdgm-edit.component.html',
  styleUrls: ['./bpmsdgm-edit.component.scss']

})


export class BpmsdgmEditComponent extends EditBaseClass implements OnInit {


  public pageTitle = 'ثبت اطلاعات فرآیند ';
  public override dataSourceObjectSet: KeyStr = {};
  public editMode: boolean = false;
  public override validationSet: ValidationSet[] = [];
  public override comboLoadList: KeyStr[] = [];
  public override modelSet: ObjKeyStr = {};
  public bpmsdgm_Properties: { [key: string]: string | number } = {};




  constructor(
    public override service: BmpsdgmService,
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
        const data = res['initData'];
        const id = this.route.snapshot.paramMap.get('id');
        this.validationSet = data.validation;
        this.setEditFormValidations();


        this.initForm();
        this.populateValidation(this.FormCtrls);
        this.comboLoadList = makeLoadList(data.load);

        if (id) {
          this.pageTitle = 'ویرایش';
          this.editMode = true;
          await this.getReport(+id);
          this.populate();
        }

      })
    )

  }

  populate() {
    if (this.reportData) {

      this.tblWfp_WorkFlows?.patchValue({
        Name: this.reportData['Name'],
        ApiKey: this.reportData['ApiKeyName'],
        Code: this.reportData['CodeId'],
        Description: this.reportData['Description'],
        RecordStatus: 'updated',
        KeyId: this.reportData['Name'],
        Command: this.reportData['Name'],
      })


      if (this.reportData?.Properties && this.reportData?.Properties.length) {
        this.bpmsdgm_Properties = separateGroupValue(
          this.reportData?.Properties
        );
        console.log('mahmmodi joon:', this.bpmsdgm_Properties);

      }
      this.setbpmsdgmProperties();
    }
  }

  setbpmsdgmProperties() {
    this.SystemMenu?.patchValue({
      SystemMenu: {
        Id: this.bpmsdgm_Properties['SystemSubMenuId'],
        Value: this.bpmsdgm_Properties['SystemSubMenuName']
      },
      RecordStatus: this.bpmsdgm_Properties['SystemMenuRecordStatus'],
      KeyId: this.bpmsdgm_Properties['SystemMenuKeyId'],
      Command: this.bpmsdgm_Properties['SystemSubMenuCommand'],

    }),
      this.WorkFlowType?.patchValue({
        WorkFlowType:  this.bpmsdgm_Properties['WorkflowTypesId'],
        RecordStatus: this.bpmsdgm_Properties['WorkflowTypesRecordStatus'],
        KeyId: this.bpmsdgm_Properties['WorkflowTypesKeyId'],
        Command: this.bpmsdgm_Properties['WorkflowTypesCommand'],
      })
    this.SystemIcon?.patchValue({
      SystemIcon: this.bpmsdgm_Properties['SystemIcon'],
      RecordStatus: this.bpmsdgm_Properties['SystemIconRecordStatus'],
      KeyId: this.bpmsdgm_Properties['SystemIconKeyId'],
      Command: this.bpmsdgm_Properties['SystemIconCommand'],
    })

    console.log('HIWorkFlowType', this.WorkFlowType);
    console.log('SystemMenu', this.SystemMenu);

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
      let contractData = this.makeContractData(formVal);
      console.log(contractData);

      contractData = [...contractData, ...this.recordStatusSet];
      const actionType = this.wpId ? 'UpdateN' : 'Insertn';
      const param = {
        Data: contractData,
        ActionType: actionType,
      };
      this.grabage.add(
        this.service.add(param).subscribe((res) => {
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
