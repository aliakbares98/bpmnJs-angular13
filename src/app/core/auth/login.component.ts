import { of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ForbiddenError } from '@errors/forbidden-error';
import { BadRequestError } from '@errors/bad-request-error';
import { SignalrService } from '@core/services/signalr.service';
import { GlobalValidators } from '@validators/global.validators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    UserName: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        GlobalValidators.noSpace,
      ],
      []
    ),
    Password: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        GlobalValidators.noSpace,
      ],
      []
    ),
    DeviceType: new FormControl(
      'eyJhbGciOiJIUzI1NiJ9.eyJEZXZpY2UgVHlwZSI6IkFkbWluIn0.BbsxB3aKkzu8sTVnbqZbC7VLTJTTzmdlkk1oGjmiyw4'
    ),
    /*  rememberMe : new FormControl('') */
  });

  private _notValid = false;
  public errMessage!: string;
  private grabage: Subscription = new Subscription();

  constructor(
    private service: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private signalr: SignalrService
  ) { }

  ngOnInit(): void { }

  get UserName() {
    return this.form.get('UserName');
  }
  get Password() {
    return this.form.get('Password');
  }

  login() {
    if (this.form.valid) {
      this.grabage.add(
        this.service
          .login(this.form.value)
          .pipe(
            switchMap(async (_) => {
              console.log(
                'this.signalr.signalrConnected',
                this.signalr.signalrConnected
              );

              if (this.signalr.signalrConnected) {
                console.log('signalrConnected');
                return of(true);
              }
              const connected = await this.signalr.start();
              console.log('connected', connected);

              return connected;
            }),
            this.signalr.pipeByApiKey('Login')
          )
          .subscribe({
            next: (v) => this.resLogin(v),
            error: (e) => this.errLogin(e),
          }


          )
      );
    }
  }

  resLogin(resp: any) {
    if (
      typeof resp.Data[0].Id !== 'undefined' &&
      resp.Data[0].Id > 0
    ) {
      // this.ngZone.run(() => this.router.navigate(['/dashboard']));
      this.getGeneralMessage();
    } else {
      this._notValid = true;
      this.errMessage = resp.Message;
      // this.signalr.stop();
    }
  }

  errLogin(error: any) {
    if (
      error instanceof BadRequestError ||
      error instanceof ForbiddenError
    ) {
      this._notValid = true;
      this.errMessage = error.error.error.message;
    }
  }

  get notValid() {
    return this._notValid;
  }

  clearInValid() {
    this._notValid = false;
  }

  getGeneralMessage() {
    this.grabage.add(
      this.service.getGeneralMessage().subscribe((res) => {
        //   console.log(res);

        if (res) {
          localStorage.setItem('hermes_generalMessage', JSON.stringify(res));
          this.ngZone.run(() => this.router.navigate(['/dashboard']));
        }
      })
    );
  }

  ngOnDestroy() {
    this.grabage.unsubscribe();
  }
}
