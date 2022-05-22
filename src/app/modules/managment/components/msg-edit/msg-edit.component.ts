import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ObjKeyStr } from '@interfaces/global.interfaces'
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditBaseClass } from '@classes/edit-base.class';
import { makeLoadList } from '@sharedMod/methods/makeLoadList';
import { MsgService } from '../../services/msg-service.service';
import { IdVal, KeyStr, ValidationSet } from '@interfaces/global.interfaces';
import { separateGroupValue } from '@methods/seprateGroupValue';

@Component({
  selector: 'app-msg-edit',
  templateUrl: './msg-edit.component.html',
  styleUrls: ['./msg-edit.component.scss']
})
export class MsgEditComponent extends EditBaseClass implements OnInit {

  public pageTitle = 'پیام جدید ';
  public override validationSet: ValidationSet[] = [];
  public ContactTypesShow: IdVal[] = [];
  public editMode: boolean = false;
  public override comboLoadList: KeyStr[] = [];
  public override dataSourceObjectSet: KeyStr = {}
  public override modelSet: ObjKeyStr = {};
  public Msg_Properties: { [key: string]: string | number } = {};
  public Msg_Mapping: { [key: string]: string | number } = {};


  constructor(
    fb: FormBuilder,
    public override service: MsgService,
    private route: ActivatedRoute,

  ) {
    super(fb);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.grabage.add(
      this.route.data.subscribe(async (res) => {
        console.log(res);
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

  override initForm: any = () => {
    this.form = this.fb.group({
      tblCore_Messages: this.fb.group({
        MessageText: this.fb.group({
          Model: [this.modelSet['MessageText']],
          MessageText: [''],
          RecordStatus: ['Inserted'],
          KeyId: [null],
          Command: [''],
        })
      }),
      tblCore_Message_Properties: this.fb.group({
        MessageTypes: this.fb.group({
          Model: [this.modelSet['MessageTypes']],
          MessageTypes: [''],
          RecordStatus: ['Inserted'],
          KeyId: [null],
          Command: [''],
        }),
        MessageObjectTypes: this.fb.group({
          Model: [this.modelSet['MessageObjectTypes']],
          MessageObjectTypes: [''],
          RecordStatus: ['Inserted'],
          KeyId: [null],
          Command: [''],
        }),
      }),
    })
  };

  populate() {
    if (this.reportData) {
      if (this.reportData?.Properties && this.reportData?.Properties.length) {
        this.Msg_Properties = separateGroupValue(
          this.reportData?.Properties
        );
      }
      this.setMsg();
    }
  }

  setMsg() {
    this.tblCore_Message_Properties?.patchValue({
      MessageTypes: {
        MessageTypes: this.Msg_Properties['MessageTypesId'],
        RecordStatus: 'updated',
        KeyId: this.Msg_Properties['MessageTypesKeyId'],
        Command: this.Msg_Properties['Msg_PropertiesCommand'],
      },
      MessageObjectTypes: {
        MessageObjectTypes: this.Msg_Properties['MessageObjectsId'],
        RecordStatus: 'updated',
        KeyId: this.Msg_Properties['MessageObjectsKeyId'],
        Command: this.Msg_Properties['MessageObjectsCommand'],
      },


    })

    this.MessageText?.patchValue({
      MessageText: this.reportData?.MessageText,
      RecordStatus: 'updated',
      KeyId: this.reportData?.KeyId,
      Command: this.reportData?.Command

    });
  }

  send() {
    const formVal = this.form.value;
    if (this.form.valid) {
      let contractData = this.makeContractData(formVal);
      contractData = [...contractData, ...this.recordStatusSet];
      const actionType = this.wpId ? 'UpdateN' : 'InsertN';
      const param = {
        Data: contractData,
        ActionType: actionType,
      };

      this.grabage.add(
        this.service.add(param).subscribe((res) => {
          console.log(res);

          // this.location.back();
        })
      );
    }
  }

  //*************** GET Control */ 

  get tblCore_Message_Properties() {
    return this.form.get('tblCore_Message_Properties') as FormGroup;
  }
  get MessageTypeId() {
    return this.tblCore_Message_Properties.get('MessageTypeId');
  }
  get MessageObjectTypeId() {
    return this.tblCore_Message_Properties.get('MessageObjectTypeId');
  }

  get tblCore_Messages() {
    return this.form.get('tblCore_Messages') as FormGroup;
  }
  get MessageText() {
    return this.tblCore_Messages.get('MessageText');
  }
  //*********** End GET form */ 

  // *************** GetRecordStatus

  get MsgTypeIdStatus() {
    return this.MessageTypeId?.get('RecordStatus')?.value;
  }
  get MsgObjTypeIdStatus() {
    return this.MessageObjectTypeId?.get('RecordStatus')?.value;
  }
  get MsgStatus() {
    return this.MessageText?.get('RecordStatus')?.value;
  }
  // ******** **End GetRecordStatus




}











