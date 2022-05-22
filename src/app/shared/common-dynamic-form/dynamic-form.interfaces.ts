import { ValidatorFn } from '@angular/forms';
import { ErroSet } from '@interfaces/global.interfaces';

export interface NgrxForms {
  data: any;
  structure: Field[];
  valid: boolean;
  errors: Errors;
  touched: boolean;
}

export interface Field {
  type: FieldType;
  name: string;
  id?: string;
  label: string;
  placeholder: string;
  validator?: ValidatorFn[];
  attrs?: any;
  list?: any;
  col?: string;
  multiple?: boolean;
  default?: number;
  model?: string;
  errors?: ErroSet[];
  order: number;
}
export interface RangeField {
  type: string;
  name: Range;
  id?: Range;
  label: Range;
  placeholder: Range;
  validator?: ValidatorFn[];
  attrs?: any;
  list?: any;
  col?: Range;
  multiple?: boolean;
  default?: number;
  model?: Range;
  errors?: ErroSet;
  order: number;
}

export interface Range {
  From: string;
  To: string;
}

export type FieldType =
  | 'TextBox'
  | 'TextArea'
  | 'Chips'
  | 'DropDown'
  | 'Range'
  | 'ComboBox';

export interface Errors {
  [key: string]: string;
}
