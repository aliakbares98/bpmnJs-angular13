import { OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { HostListener } from '@angular/core';
import { Input } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[modelStatus]',
})
export class RecordStatusDirective {
  @Input() public editMode!: boolean;
  @Input() public isCombo!: boolean;
  @Input() public isBtn!: boolean;

  @Output() public changed = new EventEmitter();

  constructor() {}

  @HostListener('change') onChangeText() {
    this.emitChanged();
  }
  @HostListener('selectionChange') onChangeSelect() {
    this.emitChanged();
  }
  @HostListener('input') onChangeComboText() {
    this.emitChanged();
  }
  @HostListener('optionSelected') onChangeComboSelect() {
    if (this.isCombo) this.emitChanged();
  }
  @HostListener('click') onClickBtn() {
    if (this.isBtn) this.emitChanged();
  }

  emitChanged() {
    // console.log('editMode', this.editMode);
    //console.log('status', this.status);

    if (
      this.editMode 
    ) {
      this.changed.emit(true);
    }
  }
}
