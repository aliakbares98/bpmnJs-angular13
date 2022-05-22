// import {
//   Directive,
//   EventEmitter,
//   HostListener,
//   Input,
//   SimpleChanges,
// } from '@angular/core';
// import { NgControl } from '@angular/forms';
// import { toEnNumber } from '@methods/toEnNumber';
// import { OnChanges } from '@angular/core';

// @Directive({
//   selector: '[formControlName][rialFormater]',
// })
// export class RialFormater implements OnChanges {
//   @Input() input: any;
//   @Input() onSend!: EventEmitter<any>;
//   constructor(public ngControl: NgControl) { }

//   private newValue = '';
//   //private init = true;

//   ngOnInit() {
//     if (this.onSend) {
//       this.onSend.subscribe((send) => {
//         if (this.ngControl['formDirective']['form'].valid) {
//           this.newValue = this.newValue.replace(/,/g, '');
//         }

//         this.ngControl.control?.setValue(this.newValue);
//       });
//     }
//   }
//   ngOnChanges(changes: SimpleChanges) {
//     let amount = changes[this.input].currentValue?.value;
//     if (changes[this.input] && amount) {
//       if (typeof amount === 'number') {
//         amount = amount.toString();
//       }

//       this.addComma(amount);
//       this.ngControl.control?.setValue(this.newValue);
//     }
//   }

//   @HostListener('document:submit')
//   onsubmit() {
//     console.log('rial', this.ngControl['formDirective']);

//     if (this.ngControl['formDirective']['form'].valid) {
//       this.newValue = this.newValue.replace(/,/g, '');
//     }

//     this.ngControl.control?.setValue(this.newValue);
//   }

//   @HostListener('keyup', ['$event'])
//   checkCellPhone(event: any) {

//     const inputKey = event.key;
//     let amount = event.target.value;

//     if (typeof amount === 'number') {
//       amount = amount.toString();
//     }

//     amount = amount.replace(/,/g, '');

//     if (inputKey == 'Alt' || inputKey == 'Shift' || inputKey == 'Control')
//       return;

//     if (
//       /^[\u06F0-\u06F90-9]+$/.test(inputKey) ||
//       inputKey === 'Backspace' ||
//       (inputKey === undefined && event.type === 'keyup')
//     ) {
//       amount = toEnNumber(amount);
//       this.addComma(amount);
//     } else {
//       this.newValue = event.target.value.substring(
//         0,
//         event.target.value.length - 1
//       );
//     }

//     this.ngControl.control?.setValue(this.newValue);
//   }

//   /*   @HostListener('ngModelChange', ['$event'])
//   onInit(amount) {
//     if (this.init) {
//       this.init = false;
//       if (typeof amount === 'number') {
//         amount = amount.toString();
//       }

//       this.addComma(amount);
//       this.ngControl.control?.setValue(this.newValue);
//     }
//   } */

//   addComma(amount: any) {
//     let newstr = '';
//     let count = 0;
//     if (amount) {
//       const chars = amount.split('').reverse();
//       for (const x in chars) {
//         count++;
//         if (count % 3 === 1 && count !== 1) {
//           newstr = chars[x] + ',' + newstr;
//         } else {
//           newstr = chars[x] + newstr;
//         }
//       }
//     }
//     this.newValue = newstr;
//   }
// }
