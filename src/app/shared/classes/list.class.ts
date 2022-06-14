import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import {
  EmitEvent,
  EventBusService,
  Events,
} from '@core/services/event-bus.service';
import { SnackBarService } from '@core/services/snack-bar.service';
import {
  LinkClass,
  AccessParam,
  MainStructure,
} from '@interfaces/global.interfaces';
import { Router } from '@angular/router';
import { findFormNameBy } from '@sharedMod/methods/findFormName';
import { setLocalItemBy } from '@sharedMod/methods/setLocalItemBy';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { markFormGroupTouched } from '../methods/markFormGroupTouched';
import { makeLoadList } from '@sharedMod/methods/makeLoadList';
import { toUniqueAndSorted } from '@sharedMod/methods/toUniqueAndSorted';
import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SearchItem, ValidationSet } from '../interfaces/global.interfaces';
import { withValidationManager } from '@sharedMod/methods/withValidationManager';
import { withPagination } from '@sharedMod/methods/withPagination';
import { DFSearchComponent } from '@sharedMod/common-dynamic-form/df-search/df-search.component';
import { Field, RangeField } from '@sharedMod/common-dynamic-form/dynamic-form.interfaces';

@Component({
  selector: 'app-list',
  template: '',
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }), // initial
        animate(
          '1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 })
        ), // final
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate(
          '1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)',
            opacity: 0,
            height: '0px',
            margin: '0px',
          })
        ),
      ]),
    ]),

    trigger('list', [
      transition(':enter', [query('@items', stagger(300, animateChild()))]),
    ]),
  ],
})
export class ListClass
  extends withPagination(withValidationManager())
  implements OnInit, OnDestroy {
  @ViewChild(DFSearchComponent)
  searchFilter!: DFSearchComponent;

  @Output('fromSerial')
  fromSerial = new EventEmitter();
  @Output('toSerial') toSerial = new EventEmitter();
  @Output('fromDate') fromDate = new EventEmitter();
  @Output('toDate') toDate = new EventEmitter();

  private filterSource$ = new BehaviorSubject<any[]>([]);
  filterSourceChanged$ = this.filterSource$.asObservable();

  public selectedStatus!: Array<string>;

  // ........... Filter Property ...........//
  public override showList: any;
  public override filterList: any;
  public override mainList: any;

  /* Service */
  public override service: any;

  public selectedFromSerial!: number;
  public selectedUntilSerial!: number;
  public selectedFromDate!: number;
  public selectedUntilDate!: number;
  public modulPermisions!: AccessParam[];
  public permisionKey!: string;
  public accessEl!: AccessParam;
  public newLink!: string;

  /* filter ang grid properties */
  public serverSideStructure: (Field | RangeField)[] = [];
  public clientSideStructure: (Field | RangeField)[] = [];
  public priClientSideStructure: (Field | RangeField)[] = [];
  public clientStructureKeys: any[] = [];
  public mainStructure!: MainStructure;
  public buttons: any = [];
  public clientFilterlist: any = [];
  public filterOption: any = [];
  public rangeSet: any = [];
  public searchValidation: ValidationSet[] = [];
  public classifiedValidation: any = [];
  public newAccesssEl;
  public isItemCollector: boolean = false;
  public grabage: Subscription = new Subscription();
  isSticky: boolean = false;

  constructor(
    public eventbus: EventBusService,
    public snackBar?: SnackBarService,
    public router?: Router
  ) {
    super();
  }

  async ngOnInit() {
    this.eventbus.emit(new EmitEvent(Events.Loading, this.service));
    this.clearContractIds();
    this.getModulePermisions();
    this.setKeysForSearchStructureReq();
    this.newAccesssEl = this.findPermisionBy('New');

    const initData = await this.service.resolveValidation()?.toPromise();
    this.validationSet = initData.validation;

    this.makeEditFormEssentialSets();
    this.makeBaseFormEssentials();
    if (initData.load) {
      this.comboLoadList = makeLoadList(initData.load);
    }

    this.makeFilterStructure();
    this.setKeysForPage();
  }

  clearContractIds() {
    sessionStorage.removeItem('hermes_cpsId');
    sessionStorage.removeItem('hermes_wpId');
    sessionStorage.removeItem('hermes_WorkFlowTypeCommand');

    if (this.service) {
      this.service.signalr.contractIdsSubject$.next({
        CurrentProcessStatusId: null,
        WorkflowProcessId: null,
      });
      this.service.signalr.formActionSubject$.next(null);
    }
  }

  setKeysForSearchStructureReq() {
    const accesssEl = this.findPermisionBy('Srch');
      
    if (accesssEl) {
      this.setApiKeyAndFormName(this.permisionKey, accesssEl.WorkFlowFormName);
      setLocalItemBy(
        accesssEl.WorkFlowTypeCommand,
        'hermes_WorkFlowTypeCommand'
      );
    }
  }
  setKeysForPage() {
    const accesssEl =
      this.findPermisionBy('New') ||
      this.findPermisionBy('Edit') ||
      this.findPermisionBy('Show');

    if (accesssEl) {
      this.setApiKeyAndFormName(this.permisionKey, accesssEl.WorkFlowFormName);
    }
  }

  sortData(sort: Sort) {
    // /*     const matHeader = document.querySelector(
    //   `[mat-sort-header="${sort.active}"]`
    // );
    // const svgTag = matHeader.querySelector('svg');
    // svgTag.style.display = 'none'; */

    let data = this.filterList.slice();

    if (!sort.active || sort.direction === '') {
      // svgTag.style.display = 'block';
    } else {
      data = data.sort((a: any, b: any) => {
        const isAsc = sort.direction === 'asc';
        return this.compareBy(a, b, sort.active, isAsc);
      });
    }

    this._count = data.length;
    this._pageNo = 1;
    const sliceArg = {
      items: data,
      pageNo: 1,
      perPage: this.perPage,
    };

    this.showList = this.sortedData = this.sliceData(sliceArg);
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareBy(a: any, b: any, active: any, isAsc: any) {
    return this.compare(a[active], b[active], isAsc);
  }

  setContractIds(cpsId: number, wpId: number) {
    this.service.signalr.contractIdsSubject$.next({
      CurrentProcessStatusId: cpsId,
      WorkflowProcessId: wpId,
    });
  }

  setApiKeyAndFormName(apiKey: string = '', formName: string = '') {
    this.service.signalr.formNameAndApiKeySubject$.next({
      ApiKey: apiKey,
      FormTag: formName,
    });
  }

  getModulePermisions() {
    if (this.router) {
      const urlSet = this.router.url.split('/');
      this.permisionKey = urlSet[urlSet.length - 1];
      const permisionSet = JSON.parse(
        localStorage.getItem('hermes_permissionSet') || ''
      );

      this.modulPermisions = permisionSet[this.permisionKey];
      
    }
  }

  findPermisionBy(type: string) {
    if (this.modulPermisions) {
      const accesssEl = this.modulPermisions.find(
        (el: AccessParam) => el.WorkFlowTypeCommand === type
      );

      return accesssEl;
    }
    return;
  }

  setContractKeys(linkClass, item) {
    const formName = findFormNameBy(linkClass.FormName, 3);

    this.service.signalr.formActionSubject$.next(linkClass.WorkFlowTypeCommand);
    this.setApiKeyAndFormName(linkClass.ApiKey, formName);
    if (item?.LastWorkFlowProcessStatusId) {
      this.setContractIds(item?.LastWorkFlowProcessStatusId, item?.Id);
    }
  }

  setRoutState(linkClass, item) {
    if (linkClass.Page) {
      const url = linkClass.Page.replace(':Id', item.Id);
      this.router?.navigate(['/' + url], {
        state: {
          cpsId: item?.LastWorkFlowProcessStatusId,
          wpId: item?.Id,
          ApiKey: linkClass.ApiKey,
          FormName: linkClass.FormName,
          WorkFlowTypeCommand: linkClass.WorkFlowTypeCommand,
        },
      });
    }
  }

  iconAction(linkClass: LinkClass, item) {
    this.setContractKeys(linkClass, item);
    this.setRoutState(linkClass, item);
  }

  createNew() {
    if (this.isItemCollector) {
      this.newAccesssEl = this.findByApiKey('ChequeNew');
    }
    if (this.newAccesssEl) {
      this.setApiKeyAndFormName(
        this.newAccesssEl.ApiKey,
        this.newAccesssEl.WorkFlowFormName
      );
      this.newLink = `/${this.newAccesssEl.AccessLink[0]}`;
      this.service.signalr.formActionSubject$.next(
        this.newAccesssEl.WorkFlowTypeCommand
      );
      this.router?.navigate([this.newLink], {
        state: {
          ApiKey: this.newAccesssEl?.ApiKey,
          FormName: [
            { ObjectTypeCode: 3, Name: this.newAccesssEl?.WorkFlowFormName },
          ],
          WorkFlowTypeCommand: this.newAccesssEl?.WorkFlowTypeCommand,
        },
      });
    }
  }

  findByApiKey(apiKey: string) {
    if (this.modulPermisions) {
      const accesssEl = this.modulPermisions.find(
        (el: AccessParam) => el.ApiKey === apiKey
      );

      return accesssEl;
    }
    return;
  }

  deleteRow(id: number) {
    this.service.delete(id);
  }

  clearApiKeyAndFormName() {
    sessionStorage.removeItem('hermes_ApiKey');
    sessionStorage.removeItem('hermes_FormName');

    if (this.service) {
      this.service.signalr.formNameAndApiKeySubject$.next({
        ApiKey: null,
        FormTag: null,
      });
    }
  }

  override trackByFn(index: number, el: any): number {
    return el.Id;
  }

  ///////////Crete sidbar filter and grid dynamically //////////////

  /* init server & client & grid filter structure */
  makeFilterStructure() {
    this.classifiedValidation = this.classifyByTabName(this.validationSet);

    if (typeof this.classifiedValidation['ServerSide'] !== 'undefined') {
      const serverSide = this.makeDFStructure(
        this.classifiedValidation['ServerSide']
      );
      this.serverSideStructure = [...serverSide];
    }

    if (typeof this.classifiedValidation['ClientSide'] !== 'undefined') {
      this.priClientSideStructure = this.makeDFStructure(
        this.classifiedValidation['ClientSide']
      );

      if (this.priClientSideStructure.length) {
        const priStructure = [...this.priClientSideStructure];
        this.clientStructureKeys = priStructure.map((el) => el.name);
        this.priClientSideStructure = this.priClientSideStructure.map((el) => {
          if (el.type === 'DropDown') {
            el.type = 'Select';
            el.multiple = true;
            if (el.name === 'RowCount') {
              el.list = environment.settings.perPageSet;
              el.multiple = false;
            }
          }

          return el;
        });
      }
    }

    if (typeof this.classifiedValidation['Main'] !== 'undefined') {
      this.mainStructure = this.makeGridStructure(
        this.classifiedValidation['Main']
      );

      if (this.mainStructure?.otherList.length > 0) {
        this.searchValidation = this.mainStructure?.otherList;
      }
    }
  }

  classifyByTabName(validationSet) {
    let result: any = [];

    validationSet.forEach((item) => {
      if (item.TabName) {
        if (typeof result[item.TabName] !== 'undefined') {
          result[item.TabName] = [...result[item.TabName], item];
        } else {
          result[item.TabName] = [item];
        }
      }
    });

    return result;
  }
  /*
 returns structure to create server or client filters(as a form)
 */
  makeDFStructure(validationSet) {
    let structure: (Field | RangeField)[] = [];

    validationSet.forEach((item: any) => {
      let structureObj: Field | RangeField;
      let isMultiple: boolean = false;
      if (item?.ColumnTypeName === 'MultiSelectDropDown') {
        isMultiple = true;
        item.ColumnTypeName = 'DropDown';
      }

      if (
        item?.ColumnMask?.indexOf('<') > -1 &&
        item?.ColumnTypeName === 'TextBox'
      ) {
        const maskArr = item?.ColumnMask.split('<');

        const toObj = this.rangeSet.find((el) => {
          const splited = el.ColumnMask.split('>');
          return splited[0] === maskArr[1];
        });

        if (toObj) {
          structureObj = {
            type: 'range',
            name: {
              From: item?.ObjectCollectionName,
              To: toObj.ObjectCollectionName,
            },
            placeholder: {
              From: item?.ColumnToolTip,
              To: toObj?.ColumnToolTip,
            },
            label: {
              From: item?.ColumnLable,
              To: toObj?.ColumnLable,
            },
            model: {
              From: item?.DataSourceObjectName,
              To: toObj?.DataSourceObjectName,
            },
            errors: {},
            col: item?.Style,
            order: item?.ColumnTabIndex,
          };

          if (structure) {
            structure = [...structure, structureObj];
          } else {
            structure = [structureObj];
          }
        } else {
          const existEl = this.rangeSet.find((el) => item.ObjectCollectionName);
          if (!existEl) {
            this.rangeSet.push(item);
          }
        }
      } else if (
        item?.ColumnMask?.indexOf('>') > -1 &&
        item?.ColumnTypeName === 'TextBox'
      ) {
        const maskArr = item?.ColumnMask?.split('>');
        const fromObj = this.rangeSet.find((el) => {
          const splited = el.ColumnMask.split('<');
          return splited[0] === maskArr[1];
        });

        if (fromObj) {
          structureObj = {
            type: 'Range',
            name: {
              From: fromObj?.ObjectCollectionName,
              To: item.ObjectCollectionName,
            },
            placeholder: {
              From: fromObj?.ColumnToolTip,
              To: item?.ColumnToolTip,
            },
            label: {
              From: fromObj?.ColumnLable,
              To: item?.ColumnLable,
            },
            model: {
              From: fromObj?.DataSourceObjectName,
              To: item?.DataSourceObjectName,
            },
            errors: {},
            col: item?.Style,
            order: item?.ColumnTabIndex,
          };

          if (structure) {
            structure = [...structure, structureObj];
          } else {
            structure = [structureObj];
          }
        } else {
          const existEl = this.rangeSet.find((el) => item.ObjectCollectionName);
          if (!existEl) {
            this.rangeSet.push(item);
          }
        }
      } else {
        structureObj = {
          type: item?.ColumnTypeName,
          name: item?.ObjectCollectionName,
          placeholder: item?.ColumnToolTip,
          label: item?.ColumnLable,
          model: item?.DataSourceObjectName,
          errors: {},
          list: this.comboLoadList[
            this.dataSourceObjectSet[item?.ObjectCollectionName] || ''
          ],
          col: item?.Style,
          default: +item.ColumnValue,
          multiple: isMultiple,
          order: item?.ColumnTabIndex,
        };

        if (structure) {
          structure = [...structure, structureObj];
        } else {
          structure = [structureObj];
        }
      }
    });

    return toUniqueAndSorted(structure);
  }

  /* gridStructure object is a config for main part of current page includes table header,toolbar buttons and search input  */
  makeGridStructure(validationSet) {
    let otherList: ValidationSet[] = [];
    let btnList: SearchItem[] = [];
    let gridList: SearchItem[] = [];

    validationSet.forEach((item: any) => {
      const structureObj = {
        name: item?.ObjectCollectionName,
        label: item?.ColumnLable,
        col: item?.Style,
        order: item?.ColumnTabIndex,
      };
      if (item.ColumnTypeName === 'Grid') {
        if (gridList.length) {
          gridList = [...gridList, structureObj];
        } else {
          gridList = [structureObj];
        }
      } else if (item.ColumnTypeName === 'Button') {
        if (btnList.length) {
          btnList = [...btnList, structureObj];
        } else {
          btnList = [structureObj];
        }
      } else {
        if (otherList.length) {
          otherList = [...otherList, item];
        } else {
          otherList = [item];
        }
      }
    });



    return {
      otherList: otherList,
      btnList: toUniqueAndSorted(btnList),
      gridList: toUniqueAndSorted(gridList),
    };
  }

  /* seach by text & server side filter */
  search(SearchValue) {
    let reportData = {
      ...SearchValue,
    };
    const form = this.searchFilter.serverSideForm;

    if (typeof form !== 'undefined' && form) {
      markFormGroupTouched(form);
      if (!form.valid) {
        return;
      }
      const formVal = form.value;
      reportData = {
        ...reportData,
        ...formVal,
      };
    }

    this.clientFilterlist = [];

    this.grabage.add(
      this.service.search(reportData)?.subscribe((data) => {
        if (data.length) {
          this.populateSearchItems(data);
        } else {
          this.mainList = this.filterList = this.showList = [];
          this._count = 0;
        }
      })
    );
  }

  /* populate list of client side filter after get search result */
  populateSearchItems(data) {
    this.mainList = this.filterList = data;
    data.map((item) => {
      const itemKeys = Object.keys(item);

      this.clientStructureKeys.forEach((el: any) => {
        const exist = itemKeys.indexOf(el);
        if (exist > -1) {
          if (typeof this.clientFilterlist[el] === 'undefined') {
            this.clientFilterlist[el] = [];
          }

          if (Array.isArray(item[el]) && item[el].length > 0) {
            item[el].forEach((element) => {
              if (
                element[el] &&
                this.clientFilterlist[el].indexOf(element[el]) === -1
              ) {
                this.clientFilterlist[el].push(element[el]);
              }
            });
          } else {
            if (this.clientFilterlist[el].indexOf(item[el]) === -1) {
              this.clientFilterlist[el].push(item[el]);
            }
          }
        }
      });
    });

    this.clientSideStructure = this.priClientSideStructure.map((el) => {
      if (el.name !== 'RowCount' && typeof el.name === 'string') {
        el.list = this.clientFilterlist[el.name];
      }

      return el;
    });

    this.filterByState();
  }

  /* filter client side data by selected options */
  filterByState(filter = null) {
    this.filterList = this.mainList;

    let filters = this.getFilters();
    if (filter) {
      filters = this.addFilter(filter);
    }

    filters.forEach((filter) => {
      if (filter.name === 'RowCount') {
        this.setPerpage(+filter?.selected);
      } else {
        if (filter?.selected?.length > 0) {
          this.filterList = this.filterList.filter((item) => {
            if (item[filter.name] && Array.isArray(item[filter.name])) {
              const includeSet = item[filter.name].map((element) => {
                return filter?.selected.includes(element[filter.name]);
              });
              return includeSet.includes(true);
            } else {
              return filter?.selected.includes(item[filter.name]);
            }
          });
        }
      }
    });
    this._count = this.filterList.length;
    this.goPage(1);
  }

  ////// BehaviorSubject has been used for client side filter state manager///
  private getFilters() {
    return this.filterSource$.getValue();
  }

  private setFilters(filters): void {
    this.filterSource$.next(filters);
  }

  private addFilter(filter) {
    const preFilters = this.getFilters().filter((f) => f.name !== filter.name);
    const newFilters = [...preFilters, filter];
    this.setFilters(newFilters);
    return newFilters;
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 385;
  }

  ///////////////////End BehaviorSubject/////////////////
  ngOnDestroy() {
    this.clearApiKeyAndFormName();
  }
}
