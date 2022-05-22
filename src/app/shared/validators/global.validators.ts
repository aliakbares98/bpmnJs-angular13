import {
  AbstractControl,
  ValidationErrors,
  FormControl,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
// import * as moment from 'moment';
// import * as jalaliMoment from 'jalali-moment';
// import * as jMoment from 'moment-jalaali';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class GlobalValidators {
  static noSpace(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    if ((control.value as string).indexOf(' ') >= 0) {
      return { noSpace: true };
    }

    return null;
  }

  static justDigits(control: AbstractControl): ValidationErrors {
    const enteredVal = control.value as string;

    if (!enteredVal) {
      return {};
    }

    //const patternEn = /^([0-9])*$/g;
    //const patternFa = /^[۰-۹]+$/g;
    const patternFa = /^[\u06F0-\u06F90-9]+$/g;
    const patternTest = patternFa.test(enteredVal);

    if (patternTest) {
      return {};
    }
    return { justDigits: true };
  }

  // static DateValidator(control: AbstractControl): ValidationErrors {
  //   let enteredVal = control.value;
  //   enteredVal = toEnNumber(enteredVal);

  //   const gregorian = moment(enteredVal, 'MM/DD/YYYY', true);
  //   const jalali = jalaliMoment(enteredVal, 'YYYY/MM/DD', true);

  //   if (gregorian.isValid() || jalali.isValid()) {
  //     return {};
  //   }
  //   return { invalidDate: true };
  // }

  static fileMaxSize(maxSize: number = 100): any {
    return (control: FormControl): { [key: string]: any } => {
      const file = control.value;

      if (file instanceof File && file.size > maxSize) {
        return { maxSize: true };
      }
      return { maxSize: false };
    };
  }
  static fileAllowExtention() {
    return (control: FormControl): { [key: string]: any } => {
      const file = control.value;

      const extentionSet = ['png', 'jpg', 'gif', 'pdf'];
      const ext = file.name
        .substring(file.name.lastIndexOf('.') + 1)
        .toLowerCase();

      if (file instanceof File && extentionSet.includes(ext)) {
        return { extention: true };
      }
      return { extention: false };
    };
  }

  static checkRange(from: string, to: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parentControl = control['_parent'];

      const fromVal = parentControl.get(from)?.value;
      const toVal = parentControl.get(to)?.value;
      if (!toVal && fromVal) {
        parentControl.get(to).setValue(fromVal);
      }

      if (fromVal && toVal && fromVal > toVal) {
        return { invalidRange: true };
      }

      return null;
    };
  }
  static IBANValidator(control: AbstractControl): ValidationErrors {
    const enteredVal = control.value as string;
    const patternFa = /^(?:IR)(?=.{24}$)[0-9]*$/;
    const patternTest = patternFa.test(enteredVal);
    if (patternTest) {
      return {};
    }
    return { IBANValidator: true };
  }

  static licensePlateValidator(control: AbstractControl): ValidationErrors {
    const enteredVal = control.value as string;
    const patternFa =
      /^[0-9]{2}[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی][0-9]{3}-[0-9]{2}$/;
    const patternTest = patternFa.test(enteredVal);
    if (patternTest) {
      return {};
    }
    return { licensePlateValidator: true };
  }

  static duplicateValidator(service: any, model: 'string'): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return service
        .checkDuplicate(control.value, model)
        .pipe(
          map((result: boolean) => (result ? null : { isDuplicate: true }))
        );
    };
  }

  static checkNationalIdNo(control: AbstractControl): ValidationErrors {
    const nationalIdNo = control.value;

    let Sum: number = 0;
    let Last: number;
    const fakeCode = [
      '0000000000',
      '1111111111',
      '2222222222',
      '3333333333',
      '4444444444',
      '5555555555',
      '6666666666',
      '7777777777',
      '8888888888',
      '9999999999',
    ];
    let splitedNoArr: string | number[] = Array.from(nationalIdNo);
    if (fakeCode.some((e) => e == nationalIdNo)) {
      return { invalidNationalIdNo: true };
    } else if (splitedNoArr.length != 10) {
      return { invalidNationalIdNo: true };
    }

    for (let i = 0; i < 9; i++) {
      Sum += +splitedNoArr[i] * (10 - i);
    }
    let divideRemaining = Sum % 11;
    if (divideRemaining < 2) {
      Last = divideRemaining;
    } else {
      Last = 11 - divideRemaining;
    }
    let n = splitedNoArr[9];
    if (Last == n) return { invalidNationalIdNo: false };

    return { invalidNationalIdNo: true };
  }
}
