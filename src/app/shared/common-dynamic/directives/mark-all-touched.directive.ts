import { Input, Self } from '@angular/core';
import { HostListener } from '@angular/core';
import { Directive } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector: 'form[formGroup]',
})
export class MarkAllTouchedDirective {
  @HostListener('submit')
  public onSubmit(): void {
    this.container.control?.markAllAsTouched();
  }

  constructor(@Self() private container: ControlContainer) {}
}
