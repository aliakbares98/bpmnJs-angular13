
import { Subscription, of } from 'rxjs';
import { BaseClass } from './base.class';
import { Location } from '@angular/common';
import { map, switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { makeLoadList } from '@methods/makeLoadList';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '@core/modal/modal.component';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { EventBusService, Events, EmitEvent, } from '@core/services/event-bus.service';

@Component({
  selector: 'app-show',
  template: '',
})
export class ShowClass extends BaseClass implements OnInit, OnDestroy {
  protected editMode = false;
  protected chipsList: any = [];
  structure: any;
  buttons: any = [];
  public src: string = '';
  protected override reportData: any;

  /* Service */
  public override service: any;

  public override grabage: Subscription = new Subscription();
  constructor(
    public eventbus: EventBusService,
    public elem: ElementRef,
    public router: Router,
    public route: ActivatedRoute,
    public override location: Location,
    public dialog?: MatDialog
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.eventbus.emit(new EmitEvent(Events.Loading, this.service));
    this.grabage.add(
      this.eventbus.on(Events.EditPen, (editMode: boolean) => {
        this.editMode = editMode;

        const elements =
          this.elem.nativeElement.querySelectorAll('.report-elm');

        if (this.editMode) {
          elements.forEach((el: any) => {
            el.style.cursor = 'pointer';
          });
        } else {
          elements.forEach((el: any) => {
            el.style.cursor = 'default';
          });
        }
      })
    );

    if (!this.isDeleteMode && this.service.dfContract.FormTag) {
      this.getDFValidation();
    }

    const pageState = history.state;
    this.setContractIdsByState(pageState);
    this.getValidation();
  }

  getValidation() {
    this.grabage.add(
      this.route.data.subscribe((data) => {
        this.validationSet = data["validation"];
        this.makeBaseFormEssentials();
        this.eventbus.behaviorEmit(
          new EmitEvent(Events.LabelSet, this.parallelLabelSet)
        );
      })
    );
  }

  addToChips(field: string | null) {
    if (this.editMode) {
      const hasField = this.chipsList.includes(field);
      if (hasField) {
        this.chipsList = this.chipsList.filter((item: any) => item !== field);
      } else {
        this.chipsList.push(field);
      }

      this.eventbus.emit(new EmitEvent(Events.DFChips, this.chipsList));
    }
  }

  getDFValidation() {
    this.grabage.add(
      this.service
        .getDFValidation()
        ?.pipe(
          map((validation: any[]) => {
            this.validationSet = validation;
            this.makeValidationSetGroup();
            let structure: any = [];

            if (validation && validation.length) {
              validation.map((item, key) => {
                if (item.ColumnTypeName !== 'Button') {
                  structure[key] = {
                    type: item.ColumnTypeName,
                    name: item.ObjectCollectionId.toString(),
                    placeholder: item.ObjectDesc,
                    label: item.ColumnLable,
                    validator:
                      this.fieldValidationSet[item.ObjectCollectionName],
                    model: item.ObjectCollectionModelName,
                  };
                } else {
                  this.buttons[key] = {
                    type: item.ColumnTypeName,
                    name: item.ObjectCollectionId.toString(),
                    label: item.ColumnLable,
                    value: item.ColumnValue,
                    class: item.ColumnCss,
                    model: item.ObjectCollectionModelName,
                  };
                }
              });
            }

            structure = structure.filter((item: any) => item);
            this.buttons = this.buttons.filter((item: any) => item);

            return structure;
          }),
          tap((data: any) => {
            this.structure = data.filter(
              (item: any, index: number, self: any) =>
                index === self.findIndex((t: any) => t.name === item.name)
            );
          }),
          /*         switchMap((_) => {
          return this.signalr.signalrDataChanged$.pipe(
            filter((resp) => resp.ApiKey === 'SupplierRgsRpt'),
            map((resp) => resp.Data)
          );
        }) */
          switchMap((_) => {
            const list = [
              {
                Criteria: 1,
                Id: 5,
                Model: 'BatchNumber',
                Value: 'حقيقي',
              },
              {
                Criteria: 1,
                Id: 6,
                Model: 'BatchNumber',
                Value: 'حقوقی',
              },
            ];
            return of(list);
          }),
          map((data) => {
            return makeLoadList(data);
          })
        )
        .subscribe((data: any) => {
          for (const item in data) {
            if (data[item]) {
              this.structure.map((el: any) => {
                if (el.name === item) {
                  el.list = data[item];
                }
              });
            }
          }
        })
    );
  }

  submitDF(arg: any) {
    const data: any = [];

    if (arg.form) {
      const form = { ...arg.form };
      const formKey = Object.keys(form);

      this.structure.map((el: any) => {
        const hasFormKey = formKey.findIndex((key) => key === el.name);

        if (hasFormKey > -1) {
          data.push({
            Model: el.model,
            ObjectCollectionId: el.name,
            InputValue: form[el.name],
            Criteria: null,
          });
        }
      });
    }

    const uaButton = this.buttons.find(
      (el: any) => el.value === arg.userAction
    );

    data.push({
      Model: uaButton.model,
      ObjectCollectionId: uaButton.name,
      InputValue: arg.userAction,
      Criteria: null,
    });

    const param = {
      WfpActionObjects: arg.userAction,
      ActionType: 'InsertN',
      Data: data,
      ...this.service.dfContract,
    };

    this.grabage.add(
      this.service.postUserAction(param).subscribe((data: any) => {
        this.router.navigate(['/dashboard']);
      })
    );
  }

  get isDeleteMode() {
    const url = this.router.url;
    const urlArr = url.split('/');

    if (urlArr[urlArr.length - 1] === 'Delete') {
      return true;
    }
    return false;
  }

  get hasReportData() {
    if (this.reportData) {
      return true;
    }
    return false;
  }

  removeReport() {
    const dialogRef = this.dialog?.open(ModalComponent, {
      data: {
        buttonText: { ok: 'بله', cancel: 'خیر' },
      },
    });

    dialogRef?.afterClosed().subscribe((confirmed: boolean) => {
      this.eventbus.emit(new EmitEvent(Events.BackDrop, false));
      if (confirmed) {
        let reportData;

        if (this.reportData.length > 1) {
          reportData = this.replaceModel(this.reportData);
        } else {
          reportData = this.windData(this.reportData);
        }
        this.grabage.add(
          this.service.delete(reportData)?.subscribe((_: any) => {
            this.location?.back();
          })
        );
      }
    });
  }

  replaceModel(reportData: any) {
    const newData = reportData.map((obj: any) => {
      if (Array.isArray(obj)) {
        return obj.map((el) => {
          if (el.Model) {
            el.Model = el.Model;
          }
          return el;
        });
      }
      if (obj.Model) {
        obj.Model = obj.Model;
      }
      return obj;
    });

    return newData;
  }

  getReportDetectRoute() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.getReport(+params['id']);
      }
    });
  }

  /*   setFormName(pageState: any) {
    const formName = pageState['FormName'];

    if (formName) {
      localStorage.setItem('FormName', formName);
      this.getDFValidation(this.service, formName);
    } else {
      const localFormName = localStorage.getItem('FormName');
      if (localFormName) {
        this.getDFValidation(this.service, localFormName);
      }
    }
  } */

  override ngOnDestroy() {
    this.grabage.unsubscribe();
    super.ngOnDestroy();
  }
}
