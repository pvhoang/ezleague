import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { AuthService } from "app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-auth-register",
  templateUrl: "./auth-register.component.html",
  styleUrls: ["./auth-register.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AuthRegisterComponent implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public reEnterPasswordTextType: boolean;
  public registerForm: UntypedFormGroup;
  public submitted = false;
  public loading = false;

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
    private _authService: AuthService,
    private _toastrService: ToastrService,
    private _router: Router
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
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  toggleReEnterPasswordTextType() {
    this.reEnterPasswordTextType = !this.reEnterPasswordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;
    
    console.warn(this.registerForm);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    } else {
      // show loading spinner
      this.loading = true;

      // register user
      this._authService
        .register(this.registerForm.value)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (res: any) => {
            this.loading = false;
            // show success message
            Swal.fire({
              title: "Success",
              text: res.message,
              // icon: "success",
              imageUrl: "assets/images/alerts/signup.png",
              confirmButtonText: "Ok",
              customClass: {
                container: "signup-successfull",
                confirmButton: "btn btn-gradient-primary round-15",
              },
            });

            // redirect to login page
            this._router.navigate(["/auth/login"]);
          },
          (error) => {
            // add error to form control
            let errors = error.errors;
            for (let key in errors) {
              if (errors.hasOwnProperty(key)) {
                this.registerForm.controls[key].setErrors({
                  serverError: errors[key][0],
                });
              }
            }
            // check length of array
            if (errors.length > 0) {
              // show error message
              this._toastrService.error(error.message, "Error", {
                closeButton: true,
                tapToDismiss: false,
              });
            }
            // hide loading spinner
            this.loading = false;
          }
        );
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      first_name: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern(/[\S]/),])],
      last_name: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern(/[\S]/),])],
      email: [
        "",
        Validators.compose([
          Validators.required,
          // Validators.email,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]),
      ],
      parental_consent: new FormControl(false, Validators.pattern("true")),
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
