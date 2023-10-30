import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-auth-reset-password-v1",
  templateUrl: "./auth-reset-password.component.html",
  styleUrls: ["./auth-reset-password.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AuthResetPasswordComponent implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: UntypedFormGroup;
  public submitted = false;
  public token: string;
  public email: string;
  loading = false;
  message = {
    is_err: false,
    message_error: "",
  };

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    public _authService: AuthService,
    public _route: ActivatedRoute
  ) {
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
    return this.resetPasswordForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Toggle confirm password
   */
  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    this._authService
      .resetPassword(
        this.f.newPassword.value,
        this.f.confirmPassword.value,
        this.token,
        this.email
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.loading = false;
          this.message = {
            is_err: false,
            message_error: res.message,
          };
        },
        (err) => {
          console.log(err);
          this.loading = false;
          this.message = {
            is_err: true,
            message_error: err.error.message,
          };
        }
      );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
    this.token = this._route.snapshot.paramMap.get("token");
    console.log(this.token);
    this.email = this._route.snapshot.paramMap.get("email");
    console.log(this.email);
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
