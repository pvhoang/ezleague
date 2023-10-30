import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthService } from 'app/services/auth.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { menu } from 'app/menu/menu';
import { LoadingService } from 'app/services/loading.service';
import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import { SettingsService } from 'app/services/settings.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthLoginComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private _coreMenuService: CoreMenuService,
    public _loadingService: LoadingService,
    public _notificationService: NotificationsService,
    public _settingsService: SettingsService
  ) {
    // redirect to home if already logged in
    if (this._authService.currentUserValue) {
      this._router.navigate(['/']);
    }

    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Login
    this._loadingService.shơwButtonLoading();
    this._authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          // console.log(data);
          this._coreMenuService.unregister('main');
          this._coreMenuService.register('main', menu);
          this._coreMenuService.setCurrentMenu('main');
          this._notificationService.getNotificationsData();
          this._settingsService.getInitSettings();
        },
        (error) => {
          this.error = error.message;
          console.warn(error);
          this._loadingService.dismissButtonLoading();
        }
      );
  }

  /**
   * On continue as guest
   */
  onClickContinueAsGuest() {
    this._authService
      .login('guest@ezactive.com', '12345678')
      .pipe(first())
      .subscribe(
        (data) => {
          // console.log(data);
          this._coreMenuService.unregister('main');
          this._coreMenuService.register('main', menu);
          this._coreMenuService.setCurrentMenu('main');
        },
        (error) => {
          this.error = error.message;
          console.warn(error);
          this._loadingService.dismissButtonLoading();
        }
      );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          // Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ]),
      ],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
