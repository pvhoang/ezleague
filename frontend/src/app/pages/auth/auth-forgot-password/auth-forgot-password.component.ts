import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-auth-forgot-password-v1",
  templateUrl: "./auth-forgot-password.component.html",
  styleUrls: ["./auth-forgot-password.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AuthForgotPasswordComponent implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: UntypedFormGroup;
  public submitted = false;
  loading = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    public _authService: AuthService,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    this._authService.forgotPassword(this.f.email.value).subscribe(
      (data) => {
        this.loading = false;
        console.log(data);
        // set swal.fire message success
        Swal.fire({
          title: "Success!",
          imageUrl: "assets/images/alerts/forgot-password.png",
          text: data.message,
          // icon: "success",
          confirmButtonText: "Ok",
          customClass: {
            confirmButton: "btn btn-gradient-primary round-15"
          }
          // remove cla
        }).then((result) => {
          if (result.value) {
            this._router.navigate(["/auth/login"]);
          }
        });
      },
      (error) => {
        this.loading = false;
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ["",  Validators.compose([Validators.required, 
        // Validators.email,
        Validators.pattern(
          "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
        )])],
    });

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
