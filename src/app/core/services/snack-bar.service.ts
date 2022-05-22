import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getMessageBy } from '@sharedMod/methods/getMessageBy';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(param: any) {
    const message = param.message;
    const action = param.action ? param.action : '';
    const duration = param.duration ? param.duration * 1000 : 3000;
    const hPosition = param.hPosition ? param.hPosition : 'right';
    const vPosition = param.vPosition ? param.vPosition : 'top';
    const panelClass = param.panelClass ? param.panelClass : [];
    this._snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: hPosition,
      verticalPosition: vPosition,
      panelClass: panelClass,
    });
  }

  setFieldMessage(codeMessage: number) {
    const message = getMessageBy(codeMessage);

    this.openSnackBar({
      message: message,
      action: 'بستن',
      duration: 3,
      panelClass: ['snackbar-error'],
    });
  }
}
