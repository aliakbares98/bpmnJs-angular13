import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from '../mat.module';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { PerPageComponent } from './per-page/per-page.component';
import { RecordStatusDirective } from './directives/record-status.directive';
import { DebounceClickDirective } from './directives/debounce-click.directive';
// import { RialFormater } from './directives/rial-formater.directive';
import { MarkAllTouchedDirective } from './directives/mark-all-touched.directive';

@NgModule({
  declarations: [
    ComboBoxComponent,
    PerPageComponent,
    RecordStatusDirective,
    DebounceClickDirective,
    // RialFormater,
    MarkAllTouchedDirective,
  ],
  imports: [CommonModule, MatModule],
  exports: [
    ComboBoxComponent,
    PerPageComponent,
    RecordStatusDirective,
    DebounceClickDirective,
    // RialFormater,
    MarkAllTouchedDirective,
  ],
})
export class CommonDynamicModule {}
