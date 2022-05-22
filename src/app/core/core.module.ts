import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatModule } from '@sharedMod/mat.module';
import { SvgComponent } from './svg/svg.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalService } from './modal/modal.service';
import { MainComponent } from './main/main.component';
import { MenuService } from './services/menu.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FixLengthPipe } from './pipes/fix-length.pipe';
import { ModalComponent } from './modal/modal.component';
import { OverlayModule } from './overlay/overlay.module';
import { AuthInterceptor } from './auth/authInterceptor';
import { NotifyService } from './services/notify.service';
import { SignalrService } from './services/signalr.service';
import { HeaderComponent } from './header/header.component';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-check';
import { NotifyComponent } from './header/notify/notify.component';
import { MasterDetailService } from './services/master-detail.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserMenuComponent } from './header/user-menu/user-menu.component';
import { InitDataResolverService } from './services/init-data-resolver.service';
import { NotifyCardComponent } from './header/notify/notify-card/notify-card.component';



@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    UserMenuComponent,
    NotifyComponent,
    NotifyCardComponent,
    ModalComponent,
    SvgComponent,
    FixLengthPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    OverlayModule,
    MatModule,
    FlexLayoutModule,
  ],
  exports: [
    MainComponent,
    HeaderComponent,
    UserMenuComponent,
    NotifyComponent,
    NotifyCardComponent,
    SvgComponent,
    FixLengthPipe,

  ],
  entryComponents: [ModalComponent],
  providers: [
    SignalrService,
    NotifyService,
    MasterDetailService,
    ModalService,
    MenuService,
    InitDataResolverService,
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
