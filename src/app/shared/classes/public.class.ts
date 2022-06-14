import { Component, OnInit, OnDestroy } from '@angular/core';
import { Attachment, ValidationSet } from '@interfaces/global.interfaces';
import { Subscription } from 'rxjs';

import { RecordStatus } from '../interfaces/global.interfaces';
import { getMessageBy } from '@sharedMod/methods/getMessageBy';
import { makeDeletedObj } from '@sharedMod/methods/makeDeletedObj';
import { setLocalItemBy } from '@sharedMod/methods/setLocalItemBy';

@Component({
  selector: 'public',
  template: '',
})
export class PublicClass implements OnInit, OnDestroy {
  private contractData: any = [];
  protected validationSet: ValidationSet[] = [];
  protected recordStatusSet: RecordStatus[] = [];

  protected grabage: Subscription = new Subscription();
  public service: any;
  protected reportData: any;
  protected formEdited = false;
  protected workFlowTypeCommand!: string;
  protected wpId!: number;
  protected cpsId!: number;

  constructor() { }

  ngOnInit(): void { }

  /*.....................prepare data to send by http request..........*/

  /*
    wind data after form submited
  */
  windData(items: any) {
    this.contractData = [];
    if (items) {
      const header:any = {};
      let fieldArr = false;
      for (const itemKey in items) {
        if (Array.isArray(items[itemKey])) {
          /* array which contain some object and array */

          for (const subItemKey in items[itemKey]) {
            if (items[itemKey][subItemKey]) {
              const subItemValue = { ...items[itemKey][subItemKey] };

              const subItemValueInput: any = [{}];
              for (const elKey in subItemValue) {
                if (subItemValue[elKey] instanceof Array) {
                  for (const innerKey in subItemValue[elKey]) {
                    if (typeof subItemValue[elKey][innerKey] === 'object') {
                      this.findFeildInObject(subItemValue[elKey][innerKey]);
                    } else {
                      fieldArr = true;
                    }
                  }

                  if (fieldArr) {
                    subItemValueInput[elKey] = subItemValue[elKey];
                    fieldArr = false;
                  }
                } else if (
                  typeof subItemValue[elKey] === 'object' &&
                  subItemValue[elKey] !== null
                ) {
                  this.findFeildInObject(subItemValue[elKey]);
                } else if (
                  typeof subItemValue[elKey] === 'string' ||
                  typeof subItemValue[elKey] === 'number' ||
                  typeof subItemValue[elKey] === 'boolean'
                ) {
                  subItemValueInput[elKey] = subItemValue[elKey];
                }
              }

              this.findFeildInObject(subItemValueInput);
            }
          }
        } else if (
          typeof items[itemKey] === 'object' &&
          items[itemKey] !== null
        ) {
          this.findFeildInObject(items[itemKey]);
        } else if (
          typeof items[itemKey] === 'string' ||
          typeof items[itemKey] === 'number' ||
          typeof items[itemKey] === 'boolean'
        ) {
          /* flat fields in main object which called header */
          header[itemKey] = items[itemKey];
        }
      }

      if (Object.keys(header).length > 0) {
        this.addModelToContract(header);
      }

      return this.contractData;
    }
  }

  private filterNullFeild(data:any) {
    const filtered: any = {};
    for (let itemKey in data) {
      if (data[itemKey] !== null) {
        filtered[itemKey] = data[itemKey];
      }
    }

    filtered.Criteria = null;
    return filtered;
  }

  private addModelToContract(modelObj:any) {
    if (typeof modelObj === 'object') {
      const filtered = this.filterNullFeild(modelObj);
      this.contractData.push(filtered);
    }
  }

  private checkLicense(modelObj:any) {
    let licenseflag = false;
    const modelkeys = Object.keys(modelObj);
    const commonKeyArr = ['Model', 'RecordStatus', 'MasterId', 'ClientId'];
    modelkeys.forEach((modelKey) => {
      const modelKeyInclud = commonKeyArr.includes(modelKey);
      if (!modelKeyInclud && modelObj[modelKey] !== '') {
        licenseflag = true;
      }
    });

    return licenseflag;
  }

  private findFeildInObject(input:any) {
    const output:any = {};

    for (const innerKey in input) {
      if (
        typeof input[innerKey] === 'object' &&
        input[innerKey] !== null &&
        !Array.isArray(input[innerKey])
      ) {
        this.findFeildInObject(input[innerKey]);
      } else if (
        typeof input[innerKey] === 'string' ||
        typeof input[innerKey] === 'number' ||
        typeof input[innerKey] === 'boolean' ||
        (Array.isArray(input[innerKey]) &&
          typeof input[innerKey][0] !== 'object')
      ) {
        output[innerKey] = input[innerKey];
      } else if (
        Array.isArray(input[innerKey]) &&
        typeof input[innerKey][0] === 'object'
      ) {
        this.findFeildInObject(input[innerKey]);
      }
    }

    const hasLicense = this.checkLicense(output);

    if (hasLicense) {
      this.addModelToContract(output);
    }
  }

  /*
    check and remove empty attachment in formArray after for submited
  */
  filterAttachment(formValue: any) {
    if (
      formValue['tblCore_Attachments'] === undefined ||
      formValue['tblCore_Attachments'] === null
    ) {
      return formValue;
    }
    formValue['tblCore_Attachments'] = formValue['tblCore_Attachments'].filter(
      (el: Attachment) => el.AttachmentCategory !== '' || el.Attachment !== ''
    );
    if (formValue['tblCore_Attachments'].length === 0) {
      delete formValue['tblCore_Attachments'];
    }

    return formValue;
  }

  /*
   prepare contract data to send
   */
  makeContractData(items: any) {
    const filteredItems = this.filterAttachment(items);
    return this.windData(filteredItems);
  }

  comlpexArrayMakeContract(items: any) {
    let windedItems: any = [];
    items.forEach((el: any) => {
      const windedData: any = this.windData(el);
      for (const dataKey in windedData) {
        windedItems.push(windedData[dataKey]);
      }
    });

    return windedItems;
  }

  /*.....................End prepare data to send by http request..........*/


  /* set Updated value to dirty or touched field on edit mode */
  updateRecordStatus(model:any, status:any) {
    if (this.workFlowTypeCommand === 'Edit' && !status) {
      model.get('RecordStatus')?.setValue('Updated');
      this.formEdited = true;
      this.service?.formEdited$?.next(true);
    }
  }
  /* add deleted ctrl to recordStatusSet
    if this intent group has KeyId value we add it in recordStatusSet
  */
  updateRecordStatusSetBy(formGroup:any) {
    const deleted = makeDeletedObj(formGroup);
    if (deleted) {
      this.recordStatusSet.push(deleted);
      this.setEditedForm();
    }
  }

  // updateSubjectRecordStatusSetBy(formGroup) {
  //   const keyId = formGroup.get('KeyId')?.value;
  //   if (keyId) {
  //     const model = formGroup.get('Model')?.value;
  //     const deleted = {
  //       KeyId: keyId,
  //       Model: model,
  //       RecordStatus: 'Deleted',
  //       Criteria: null,
  //     };
  //     if (this.workFlowTypeCommand === 'Edit') {
  //       this.service?.formEdited$?.next(true);
  //       this.addDeletedRecordStatus(deleted);
  //     }
  //   }
  // }

  // private getDeletedRecordStatus(): DeletedRecord[] {
  //   return this.service?.recordStatusBehavior$?.getValue();
  // }

  // private setDeletedRecordStatus(contracts: DeletedRecord[]): void {
  //   this.service?.recordStatusBehavior$?.next(contracts);
  // }

  // private addDeletedRecordStatus(deletedRecord: DeletedRecord): void {
  //   const preSet = this.getDeletedRecordStatus();
  //   const newSet = [...preSet, deletedRecord];
  //   this.setDeletedRecordStatus(newSet);
  // }

  /* get Edit And Show page data */
  getReport(id: number) {
    return new Promise((resolve, reject) => {
      this.grabage.add(
        this.service.report(id)?.subscribe(
          (data: any) => {
            if (data && data.length) {
              const reportData = JSON.parse(JSON.stringify(data));
              this.reportData = reportData[0];
            }
            resolve(true);
          },
          (error: any) => {
            reject(false);
          }
        )
      );
    });
  }

  /* make dialog box with specific message id */
  setFieldMessage(codeMessage: number) {
    const message = getMessageBy(codeMessage);
    this.service.signalr.openSnackBar({
      message: message,
      action: 'بستن',
      duration: 3,
      panelClass: ['snackbar-error'],
    });
  }

  setEditedForm() {
    if (this.workFlowTypeCommand === 'Edit') {
      this.formEdited = true;
    }
  }

  /*
    set setContractIds and cach it
  */
  setContractIdsByState(pageState: any) {
    const cpsId = pageState['cpsId'];
    const wpId = pageState['wpId'];

    this.cpsId = +setLocalItemBy(cpsId, 'hermes_cpsId');
    this.wpId = +setLocalItemBy(wpId, 'hermes_wpId');

    if (this.service) {
      this.service.signalr.contractIdsSubject$.next({
        CurrentProcessStatusId: this.cpsId,
        WorkflowProcessId: this.wpId,
      });
    }
  }

  load(data: any) {
    if (data && data.length) {
      data.map((item: any) => {
        const self: any = this;
        if (self[item.Model]) {
          if (item.ObjectName && item.ColumnKeyName && item.ColumnKeyValue) {
            self[item.Model].push({
              Id: item.Id,
              Value: item.Value,
              ObjectName: item.ObjectName,
              ColumnKeyName: item.ColumnKeyName,
              ColumnKeyValue: item.ColumnKeyValue,
            });
          } else {
            self[item.Model].push({
              Id: item?.Id,
              Value: item?.Value || item?.Name,
            });
          }
        }
      });
    }
  }
  isEditMode(url: string) {
    const urlArr = url.split('/');

    if (urlArr[urlArr.length - 1] === 'Edit') {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.grabage.unsubscribe();
  }
}
