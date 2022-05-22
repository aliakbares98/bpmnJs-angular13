import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CellphoneValidators {
  static starter(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    if ((<string>control.value).substring(0, 2) != '09') {
      return { starter: true };
    }

    return null;
  }
}
