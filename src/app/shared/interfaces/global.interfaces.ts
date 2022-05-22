import { ValidatorFn } from '@angular/forms';

export interface IdVal {
  Id: any;
  Value: any;
  Model?: string;
}
export interface IdName {
  Id: any;
  Name: any;
  Model?: string;
}
export interface IdCode {
  id: number;
  code: number;
}
export interface Contract {
  RequestId?: string;
  ApiKey?: string;
  ActionType?: string | null;
  UserId?: string | null;
  Data?: any | null;
  WorkflowProcessId?: number | null;
  CurrentProcessStatusId?: number | null;
  Status?: string | null;
  Message?: string | null;
  WfpActionObjects?: number | null;
  FormTag?: string | null;
}
export interface ContractWithUserAction extends ContractWithActionType {
  WfpActionObjects: number | null;
}
export interface ContractWithActionType extends ContractWithData {
  ActionType: string | null;
}
export interface ContractWithData {
  Data: any | null;
}

export interface StoreroomHeader {
  Calender_ExcutionDate: number;
  Center_ContactRoleName: string;
  Inventory_ContactRoleName: string;
  AccountSide_ContactRoleName: string;
  Reference: string;
  Description: string;
}
export interface GroupField {
  GroupValueName: string;
  GroupValueId: number;
  Command: string;
  RecordStatus: string;
  KeyId: number;
  MasterId?: number;
}

export interface GeneralMessage {
  CodeMessage: number;
  MessageText: string;
}
export interface Product extends IdName {
  Code: number;
}
export interface ComboItem extends IdVal {
  Code: number | string;
}
export interface ProductPacking extends IdVal {
  Qty: number;
  IsForSupply: boolean;
  Price: number;
}
export interface FieldValidationSet {
  [key: string]: ValidatorFn[];
}
export interface SnackBar {
  message: string;
  action: string;
  duration: number;
  hPosition: string;
  vPosition: string;
  panelClass: Array<string>;
}
export interface ValidationSet {
  ColumnCss: string | null;
  ColumnIsRequired: boolean;
  ColumnKeyName: string;
  ColumnKeyValue: string | null;
  ColumnLable: string;
  ColumnMask: string | null;
  ColumnMessageId: number | null;
  ColumnMessageText: string | null;
  ColumnTabIndex: number | null;
  ColumnToolTip: string | null;
  ColumnTypeId: number | null;
  ColumnTypeName: string | null;
  ColumnValue: string | null;
  DataSourceObjectName: string | null;
  DefaultValues: string | null;
  FieldName: string;
  Id: string | null;
  ObjectCollectionId: number | null;
  ObjectCollectionModelId: number | null;
  ObjectCollectionModelName: string;
  ObjectCollectionName: string;
  ObjectDesc: string | null;
  ObjectId: number | null;
  ObjectName: string | null;
  ObjectTypeId: number | null;
  ObjectTypeName: string | null;
  ReportKey: string | null;
  Style: string | null;
  TabName: string | null;
  ValueRequirement: number | null;
  IsDisable: boolean | null;
  ViewModelObjectName: string | null;
}
export interface ErroSet {
  [key: string]: ObjKeyStr[];
}
export interface SliceData {
  pageNo: number;
  perPage: number;
  items: any;
}
export interface Attachment {
  Model?: string;
  Attachment: string;
  AttachmentCategory: string;
  CategoryId?: number;
  Id?: number;
  KeyId?: number;
  Name?: string;
  RecordStatus?: string;
}
export interface StatusValue {
  Data: CommentData[];
  InsertDate: string;
  InsertTime: string;
  Name: string;
}

export interface CommentData {
  KeyName: string;
  Value: string;
  Label: string;
  Style: string;
}

export interface DetailState {
  isRegistered: boolean;
  isEditMode: boolean;
  isDetail: boolean;
  status: string;
  batchNoStatus?: string;
  clientId?: string;
  id?: number;
}
export interface FilterOption {
  fromSerial?: number;
  toSerial?: number;
  fromDate?: number;
  toDate?: number;
}
export interface LinkClass {
  Page: string;
  ApiKey: string;
  Icon: string;
  IconCode?: string;
  FormName: FormName[];
  WorkFlowTypeCommand: string;
  ToolTipName: string;
}

export interface AccessParam {
  ApiKey: string;
  AccessLink: string;
  WorkFlowTypeCommand: string;
  WorkFlowIconName: string;
  WorkFlowFormName: string;
}
export interface RecordStatus {
  KeyId: number;
  Model: string;
  RecordStatus: string | null;
  Criteria: string | null;
}
export interface LabelSet {
  [key: string]: string;
}
export interface FormLoad {
  Id: number;
  Model: string;
  Name?: string;
  Value?: string;
  ObjectName?: string;
  ColumnKeyName?: string;
  ColumnKeyValue?: string;
  ClientLabel?: string;
  Criteria?: number;
}

export interface FormName {
  ObjectTypeCode: number;
  Name: string;
}
export interface DeletedRecord {
  KeyId?: number | null;
  Model?: string | null;
  RecordStatus: string;
  Criteria: null;
}

export interface ObjKeyStr {
  [key: string]: string | null;
}
export interface KeyStr {
  [key: string]: string;
}
export interface SearchItem {
  col: string;
  label: string;
  name: string;
  order: number;
}

export interface MainStructure {
  btnList: SearchItem[];
  gridList: SearchItem[];
  otherList: ValidationSet[];
}
export interface ProductValueSet {
  [key: string]: ComboItem;
}
