import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { OverlayRequestInterceptor } from './overlay-request.interceptor';
import { OverlayComponent } from './overlay.component';
import { throwIfAlreadyLoaded } from '../module-import-check';

@NgModule({
  imports: [CommonModule],
  exports: [OverlayComponent],
  declarations: [OverlayComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OverlayRequestInterceptor,
      multi: true,
    },
  ],
})
export class OverlayModule {
  // Ensure that OverlayModule is only loaded into AppModule

  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: OverlayModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
