import { dateToday } from './dateToday';
import { GlobalValidators } from '@validators/global.validators';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErroSet, FieldValidationSet, KeyStr, ObjKeyStr, ValidationSet, } from '@interfaces/global.interfaces';

type Constructor<T> = new (...args: any[]) => T;

export function withValidationManager<T extends Constructor<{}>>(
  BaseClass: T = class { } as any
) {
  return class extends BaseClass {
    form!: FormGroup;
    fieldValidationSet: FieldValidationSet = {};
    fieldIsDisabledSet: { [key: string]: boolean } = {};
    validationSet: ValidationSet[] = [];
    masterName!: string;
    errorSet: ErroSet = {};
    modelSet: ObjKeyStr = {};
    dataSourceObjectSet: ObjKeyStr = {};
    defaultValueSet: ObjKeyStr = {};
    periodSet: any = [];
    parallelLabelSet: ObjKeyStr = {};
    service: any;
    reportSpModel!: string | null;
    comboLoadList: KeyStr[] = [];

    // -------------Validation------------------//

    populateValidation(FormCtrls: any) {
      if (this.validationSet) {
        for (const formCtrl in FormCtrls) {
          if (FormCtrls[formCtrl]) {
            if (FormCtrls[formCtrl] instanceof FormGroup) {
              //  this.setModelToFormGroup(formCtrl, FormCtrls[formCtrl]);
              const ctrls = (FormCtrls[formCtrl] as FormGroup).controls;
              this.addValidatotToFormGroup(ctrls);

              for (const field in ctrls) {
                if (ctrls[field]) {
                  if (ctrls[field] instanceof FormGroup) {
                    //  this.setModelToFormGroup(formCtrl, ctrls[field]);
                    const innerctrls = (ctrls[field] as FormGroup).controls;
                    this.addValidatotToFormGroup(innerctrls);
                  }
                }
              }
            } else if (FormCtrls[formCtrl] instanceof FormArray) {
              const ctrlsArr = FormCtrls[formCtrl].controls;
              this.addValidatotToFormArray(formCtrl, ctrlsArr);
            } else if (FormCtrls[formCtrl] instanceof FormControl) {
              this.addValidatotToFormControl(formCtrl, FormCtrls[formCtrl]);
            }
          } else if (FormCtrls instanceof FormGroup) {
            const ctrls = (FormCtrls as FormGroup).controls;

            this.addValidatotToFormGroup(ctrls);
          }
        }
      }
    }

    get FormCtrls() {
      return (this.form as FormGroup).controls;
    }

    addValidatotToFormGroup(ctrls: any) {
      for (const ctrl in ctrls) {
        if (ctrls[ctrl]) {
          if (ctrls[ctrl] instanceof FormControl) {
            this.addValidatotToFormControl(ctrl, ctrls[ctrl]);
          } else if (ctrls[ctrl] instanceof FormGroup) {
            // this.setModelToFormGroup(ctrl, ctrls[ctrl]);
            const innerctrls = ctrls[ctrl].controls;
            this.addValidatotToFormGroup(innerctrls);
          } else if (ctrls[ctrl] instanceof FormArray) {
            const innerctrls = ctrls[ctrl].controls;
            this.addValidatotToFormArray(ctrl, innerctrls);
          }
        }
      }
    }

    addValidatotToFormArray(modelName: string, ctrlsArr: any) {
      ctrlsArr.map((item: any) => {
        if (item instanceof FormGroup) {
          const itemCtrl = (item as FormGroup).controls;
          //  this.setModelToFormGroup(modelName, item);
          this.addValidatotToFormGroup(itemCtrl);
        } else if (item instanceof FormControl) {
          // console.log('nothing');
        }
      });
    }

    addValidatotToFormControl(formCtrlName: string, formCtrl: FormControl) {
      const fieldValidateSet = this.fieldValidationSet[formCtrlName];

      if (
        typeof fieldValidateSet !== 'undefined' &&
        fieldValidateSet.length > 0
      ) {
        formCtrl.setValidators(fieldValidateSet);
      }

      if (this.fieldIsDisabledSet[formCtrlName]) {
        formCtrl.disable();
      }
    }

    setModelToFormGroup(modelName: any, formGroup: any) {
      const validateSet = this.validationSet.find((item) => {
        return item.ObjectCollectionModelName === modelName;
      });

      if (validateSet) {
        const modelField = formGroup.get('Model');
        const modelName = validateSet.ObjectCollectionModelName;

        if (modelName && modelField) {
          modelField.setValue(modelName);
          // this.modelSet[modelName] = modelName;
          // this.service.modelSet[modelName] = modelName;
        }
      }
    }

    makeValidationSetGroup() {
      if (this.validationSet && this.validationSet.length) {
        this.validationSet.forEach((item) => {
          if (item.ColumnTypeName === 'Master') {
            this.masterName = item.FieldName;
          }

          if (item.IsDisable) {
            this.fieldIsDisabledSet[item.ObjectCollectionName] = true;
          }

          const validateSet = this.makeValidateSet(item);

          if (validateSet.length !== 0) {
            if (
              typeof this.fieldValidationSet[item.ObjectCollectionName] !==
              'undefined'
            ) {
              this.fieldValidationSet[item.ObjectCollectionName] = [
                ...this.fieldValidationSet[item.ObjectCollectionName],
                ...validateSet,
              ];
            } else {
              this.fieldValidationSet[item.ObjectCollectionName] = [
                ...validateSet,
              ];
            }
          }
        });
      }
    }

    makeValidateSet(item: any) {
      const validateSet: any[] = [];

      if (
        item.ColumnIsRequired &&
        validateSet.indexOf(Validators.required) === -1
      ) {
        const errorMessage = `وارد کردن ${item.ColumnLable} اجباری می باشد`;
        this.errorSet[item.ObjectCollectionName] = {
          ...this.errorSet[item.ObjectCollectionName],
          ...{ required: errorMessage },
        };
        validateSet.push(Validators.required);
      }
      if (item.ColumnMask) {
        if (item.ColumnMask.indexOf('max') > -1) {
          let maxMask = item.ColumnMask;
          maxMask = maxMask.replace('maxlength=', '');

          this.errorSet[item.ObjectCollectionName] = {
            ...this.errorSet[item.ObjectCollectionName],
            ...{ maxlength: item.ColumnMessageText },
          };
          validateSet.push(Validators.maxLength(+maxMask));
        } else if (item.ColumnMask.indexOf('min') > -1) {
          let minMask = item.ColumnMask;
          minMask = minMask.replace('minlength=', '');

          this.errorSet[item.ObjectCollectionName] = {
            ...this.errorSet[item.ObjectCollectionName],
            ...{ minlength: item.ColumnMessageText },
          };

          validateSet.push(Validators.minLength(+minMask));
        } else if (item.ColumnMask.indexOf('JustDigits') > -1) {
          this.errorSet[item.ObjectCollectionName] = {
            ...this.errorSet[item.ObjectCollectionName],
            ...{ justDigits: item.ColumnMessageText },
          };

          validateSet.push(GlobalValidators.justDigits);
        } else if (item.ColumnMask.indexOf('NationalCode') > -1) {
          this.errorSet[item.ObjectCollectionName] = {
            ...this.errorSet[item.ObjectCollectionName],
            ...{ invalidNationalIdNo: item.ColumnMessageText },
          };

          validateSet.push(GlobalValidators.checkNationalIdNo);
        } else if (
          item.ColumnMask.indexOf('<') > -1 &&
          item.ColumnTypeName === 'DropDown'
        ) {
          const maskArr = item.ColumnMask.split('<');

          const toObj = this.periodSet.find((el: any) => {
            const splited = el.ColumnMask.split('>');
            return splited[0] === maskArr[1];
          });

          if (toObj) {
            validateSet.push(
              GlobalValidators.checkRange(
                item.ObjectCollectionName,
                toObj.ObjectCollectionName
              )
            );
            this.errorSet[item.ObjectCollectionName] = {
              ...this.errorSet[item.ObjectCollectionName],
              ...{ invalidRange: item.ColumnMessageText },
            };

            this.errorSet[toObj.ObjectCollectionName] = {
              ...this.errorSet[toObj.ObjectCollectionName],
              ...{ invalidRange: toObj.ColumnMessageText },
            };

            this.fieldValidationSet[toObj.ObjectCollectionName] = [
              ...this.fieldValidationSet[toObj.ObjectCollectionName],
              ...validateSet,
            ];
          } else {
            const existEl = this.periodSet.find(
              (el: any) => item.ObjectCollectionName
            );
            if (!existEl) {
              this.periodSet.push(item);
            }
          }
        } else if (
          item.ColumnMask.indexOf('>') > -1 &&
          item.ColumnTypeName === 'DropDown'
        ) {
          const maskArr = item.ColumnMask.split('>');
          const fromObj = this.periodSet.find((el: any) => {
            const splited = el.ColumnMask.split('<');
            return splited[0] === maskArr[1];
          });
          if (fromObj) {
            validateSet.push(
              GlobalValidators.checkRange(
                fromObj.ObjectCollectionName,
                item.ObjectCollectionName
              )
            );

            this.errorSet[item.ObjectCollectionName] = {
              ...this.errorSet[item.ObjectCollectionName],
              ...{ invalidRange: item.ColumnMessageText },
            };
            this.errorSet[fromObj.ObjectCollectionName] = {
              ...this.errorSet[fromObj.ObjectCollectionName],
              ...{ invalidRange: fromObj.ColumnMessageText },
            };

            this.fieldValidationSet[fromObj.ObjectCollectionName] = [
              ...this.fieldValidationSet[fromObj.ObjectCollectionName],
              ...validateSet,
            ];
          } else {
            const existEl = this.periodSet.find(
              (el: any) => item.ObjectCollectionName
            );
            if (!existEl) {
              this.periodSet.push(item);
            }
          }
        } else if (item.ColumnMask.indexOf('pattern') > -1) {
          let patternMask = item.ColumnMask;
          patternMask = patternMask.replace('pattern=', '');

          this.errorSet[item.ObjectCollectionName] = {
            ...{ pattern: item.ColumnMessageText },
            ...this.errorSet[item.ObjectCollectionName],
          };
          validateSet.push(Validators.pattern(patternMask));
        } else if (item.ColumnMask.indexOf('IBANValidator') > -1) {
          this.errorSet[item.ObjectCollectionName] = {
            ...this.errorSet[item.ObjectCollectionName],
            ...{ IBANValidator: item.ColumnMessageText },
          };

          validateSet.push(GlobalValidators.IBANValidator);
        } else if (item.ColumnMask.indexOf('LicensePlateValidator') > -1) {
          this.errorSet[item.ObjectCollectionName] = {
            ...this.errorSet[item.ObjectCollectionName],
            ...{ licensePlateValidator: item.ColumnMessageText },
          };

          validateSet.push(GlobalValidators.licensePlateValidator);
        } else if (item.ColumnMask.indexOf('duplicate') > -1) {
          this.errorSet[item.ObjectCollectionName] = {
            ...this.errorSet[item.ObjectCollectionName],
            ...{ isDuplicate: item.ColumnMessageText },
          };

          validateSet.push(
            GlobalValidators.duplicateValidator(
              this.service,
              item.ObjectCollectionModelName
            )
          );
        }
      }

      return validateSet;
    }

    makeParallelLabelSet() {
      if (this.validationSet && this.validationSet.length) {
        this.validationSet.forEach((el) => {
          if (el.ObjectCollectionName) {
            this.parallelLabelSet[el.ObjectCollectionName] = el.ColumnLable;
          }
        });
      }
    }
    makeBaseFormEssentials() {
      if (this.validationSet && this.validationSet.length) {
        this.validationSet.forEach((item) => {
          if (item.ObjectCollectionName) {
            this.parallelLabelSet[item.ObjectCollectionName] = item.ColumnLable;
            this.reportSpModel = item.ViewModelObjectName;
          }
        });

        if (typeof this.service !== 'undefined') {

          this.service.reportSpModel = this.reportSpModel;
        }
      }
    }

    makeEditFormEssentialSets() {
      if (this.validationSet && this.validationSet.length) {
        this.validationSet.forEach((item) => {
          if (item.ObjectCollectionName) {
            this.dataSourceObjectSet[item.ObjectCollectionName] =
              item.DataSourceObjectName; // Used to combo list name
            this.modelSet[item.ObjectCollectionName] =
              item.ObjectCollectionModelName; //Used to set Model
            this.checkColumnType(item);
            this.defaultValueSet[item.ObjectCollectionName] =
              item.DefaultValues; //Used to set default value
          }
        });
      }

      if (
        this.dataSourceObjectSet &&
        typeof this.service?.signalr !== 'undefined'
      ) {
        this.service.signalr.dataSourceObjectSet = this.dataSourceObjectSet;
      }
    }

    checkColumnType(item: any) {
      switch (item.ColumnTypeName) {
        case 'DropDown':
        case 'MultiSelect DropDown':
          if (item.DefaultValues)
            item.DefaultValues = JSON.parse(item.DefaultValues)?.Id;
          break;
        case 'AutoComplete':
          if (item.DefaultValues)
            item.DefaultValues = JSON.parse(item.DefaultValues);
          break;
        case 'DatePicker':
          if (item.DefaultValues && item.DefaultValues === 'Today') {
            item.DefaultValues = dateToday();
          } else {
            item.DefaultValues = item.DefaultValues;
          }

          break;

        default:
          break;
      }
    }

    setEditFormValidations() {
      this.makeValidationSetGroup();
      this.makeEditFormEssentialSets();
      this.makeBaseFormEssentials();
    }

    // ----------- Validatio End ----------------------
  };
}



