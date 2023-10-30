import { CommonsService } from '../../../services/commons.service';
import { Router } from '@angular/router';
import { RegistrationService } from './../../../services/registration.service';
import { LoadingService } from './../../../services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ClubService } from './../../../services/club.service';
import { AppConfig } from './../../../app-config';

import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import Swal from 'sweetalert2';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { ImgCropperConfig } from '@alyle/ui/image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSuitableGroupComponent } from './modal-suitable-group/modal-suitable-group.component';
import { TranslateService } from '@ngx-translate/core';
import { SeasonService } from 'app/services/season.service';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { set } from 'lodash';
import { SettingsService } from 'app/services/settings.service';
import { StripeCheckoutComponent } from 'app/components/stripe-checkout/stripe-checkout.component';

@Component({
  selector: 'app-register-new-player',
  templateUrl: './register-new-player.component.html',
  styleUrls: ['./register-new-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterNewPlayerComponent implements OnInit {
  @ViewChild('formDirective') formDirective: FormGroupDirective;
  @Input() eventUpdatePlayer: EventEmitter<any> = new EventEmitter();
  @Input() registerParam: any;
  @Output() overlayClickEvent = new EventEmitter();
  public onOpenEvent = new EventEmitter();
  // private variables
  private _unsubscribeAll: Subject<any>;
  subcription: any;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];

  configPhoto: ImgCropperConfig = {
    width: 600,
    height: 800,
    resizableArea: false,
    output: {
      width: 600,
      height: 800,
    },
  };

  configDocPhoto: ImgCropperConfig = {
    width: 900,
    height: 600,
    resizableArea: false,
    output: {
      width: 900,
      height: 600,
    },
  };

  overlayImagePlayerPhoto = 'assets/images/backgrounds/player_template.png';

  // public variables
  public environment = environment;
  public contentHeader: object;

  public clubs: [];
  public documentTypes = [
    { value: 'HKID', label: 'HKID' },
    { value: 'Passport', label: 'Passport' },
  ];

  constructor(
    private _loadingService: LoadingService,
    private _registrationService: RegistrationService,
    private _seasonService: SeasonService,
    private _router: Router,
    private _commonsService: CommonsService,
    private _coreSidebarService: CoreSidebarService,
    public _modalService: NgbModal,
    private renderer: Renderer2,
    private _translateService: TranslateService,
    public _settingsService: SettingsService
  ) {
    // this.fields = [
    //   {
    //     type: 'input',
    //     key: 'first_name',
    //     props: {
    //       label: this._translateService.instant('Surname'),
    //       required: true,
    //       minLength: 2,
    //       maxLength: 50,
    //       pattern: /[\S]/,
    //     },
    //   },
    //   {
    //     type: 'input',
    //     key: 'last_name',
    //     props: {
    //       label: this._translateService.instant('Other names'),
    //       required: true,
    //       minLength: 2,
    //       maxLength: 50,
    //       pattern: /[\S]/,
    //     },
    //   },
    //   {
    //     type: 'image-cropper',
    //     key: 'photo',
    //     props: {
    //       label: this._translateService.instant('Player photo'),
    //       required: true,
    //       upload_url: `${environment.apiUrl}/files/editor`,
    //       accept: 'image/png, image/jpg, image/jpeg',
    //       // note: this._translateService.instant('Note: Image ratio is 3:4'),
    //       config: this.configPhoto,
    //       test_image: AppConfig.Fake_Player_Photo,
    //     },
    //   },
    //   {
    //     type: 'input',
    //     key: 'dob',
    //     props: {
    //       label: this._translateService.instant('Date of birth'),
    //       required: true,
    //       type: 'date',
    //     },
    //   },
    //   {
    //     type: 'radio',
    //     key: 'gender',
    //     props: {
    //       label: this._translateService.instant('Gender'),
    //       required: true,
    //       options: [
    //         {
    //           label: _translateService.instant('Male'),
    //           value: 'Male',
    //         },
    //         {
    //           label: _translateService.instant('Female'),
    //           value: 'Female',
    //         },
    //       ],
    //     },
    //     defaultValue: 'Male',
    //   },
    //   {
    //     type: 'radio',
    //     key: 'document_type',
    //     props: {
    //       label: this._translateService.instant('Document type'),
    //       required: true,
    //       type: 'select',
    //       options: this.documentTypes,
    //     },
    //     defaultValue: 'HKID',
    //   },
    //   {
    //     type: 'image-cropper',
    //     key: 'document_photo',
    //     props: {
    //       label: this._translateService.instant('Document photo'),
    //       required: true,
    //       upload_url: `${environment.apiUrl}/files/editor`,
    //       accept: 'image/png, image/jpg, image/jpeg',
    //       // note: this._translateService.instant('Note: Image ratio is 3:2'),
    //       test_image: AppConfig.Fake_ID_Photo,
    //       config: this.configDocPhoto,
    //     },
    //   },
    //   {
    //     type: 'input',
    //     key: 'document_expiry_date',
    //     props: {
    //       label: this._translateService.instant('Document expiry date'),
    //       required: false,
    //       type: 'date',
    //     },
    //     expressions: {
    //       'props.required': 'model.document_type === "Passport"',
    //       hide: 'model.document_type === "HKID"',
    //     },
    //   },
    //   {
    //     type: 'ng-select',
    //     key: 'club_id',
    //     props: {
    //       label: this._translateService.instant('Club'),
    //       required: true,
    //       closeOnSelect: true,
    //       options: [],
    //       placeholder: this._translateService.instant('Select Club'),
    //     },
    //   },
    // ];
    this.getCustomfields();
    // define default values for unsubscribe all
    this._unsubscribeAll = new Subject();
  }

  getCustomfields() {
    this.subcription = this._settingsService.customFields.subscribe((res) => {
      this.fields = res;
      this.getAllClubsIsActive();
    });
    this._settingsService.getCustomFields();
  }
  ngOnInit(): void {
    // content header
    this.contentHeader = {
      headerTitle: 'New player registration',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Registration',
            isLink: true,
            link: '/registration/select-event',
          },
          {
            name: 'Select Player',
            isLink: true,
            link: '/registration/select-player',
          },
          {
            name: 'Register New Player',
            isLink: false,
            link: '',
          },
        ],
      },
    };

    // Register function will be called when overlay is clicked
    this.overlayClickEvent.subscribe(() => {
      this.resetForm();
    });
    this.onOpenEvent.subscribe(() => {
      if (this.registerParam.updated) {
        this.updatePlayerInfo(this.registerParam.player);
      }
    });

    this._coreSidebarService.setOverlayClickEvent(
      'register-new-player',
      this.overlayClickEvent
    );
    this._coreSidebarService.setOnOpenEvent(
      'register-new-player',
      this.onOpenEvent
    );
  }

  // modal Suitatble group
  openSuitableGroupModal() {
    const modalRef = this._modalService.open(ModalSuitableGroupComponent, {
      size: 'sm',
      centered: true,
      backdrop: 'static',
    });

    this._seasonService
      .getGroupsBySeason(this._registrationService.selectedSeason['id'])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        modalRef.componentInstance.groups = data;
      });
  }

  onRegister() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // show loading
    this._loadingService.show();
    // register new player
    this._registrationService
      .registerNewPlayer(
        this.model,
        this._registrationService.selectedSeason['id']
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data) => {
          // show success message
          Swal.fire({
            title: this._translateService.instant('Notification'),
            // image Frame.png add as icon
            html:
              `
            <div class="text-center">
              <img src="assets/images/Frame.png" alt="Frame" width="200px" height="149px">

              <p class="text-center">` +
              data.message +
              `</p>
            </div>`,

            confirmButtonText: this._translateService.instant('OK'),
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          }).then((result) => {
            // redirect to registration page
            // this._router.navigate(["/registration/select-player"]);
            this.eventUpdatePlayer.emit();
            this.toggleSidebar();
          });
        },
        (error) => {
          let errors = error.errors;
          this.setServerErr(errors);
          // check length of array
          if (errors == undefined || errors.length == 0) {
            // show error message
            let message_detail = '';
            if (
              error.hasOwnProperty('error') &&
              error.error == 'NOT_SUITABLE'
            ) {
              message_detail = `<a suitableGroup= "suitableGroup" href="javascript:void(0)" class="text-primary"> 
            ${this._translateService.instant('Details')} 
            </a>`;
            }
            Swal.fire({
              title: this._translateService.instant('Notification'),
              html: ` <div class="text-center">
                <img src="assets/images/Frame.png" alt="Frame" width="200px" height="149px">
                <p class="text-center">${error.message}.
                ${message_detail}
                </p>
              </div>`,
              confirmButtonText: this._translateService.instant('OK'),
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            });
          }
        }
      );
  }

  onSubmit() {
    console.log(this.form);
    console.log('registerParam: ', this.registerParam);
    if (this.registerParam.updated) {
      this.onUpdate();
    } else {
      this.onRegister();
    }
  }

  updatePlayerInfo(player) {
    // find player.registrations by season
    let registration = player.registrations.find(
      (reg) => reg.season_id == this._registrationService.selectedSeason['id']
    );
    let temp_model = {};
    for (const key in player) {
      let value = player[key];
      if (key == 'user') {
        for (const user_key in value) {
          if (value[user_key]) temp_model[user_key] = value[user_key];
        }
      } else if (key == 'custom_fields') {
        for (const custom_key in value) {
          if (value[custom_key]) temp_model[custom_key] = value[custom_key];
        }
      } else {
        if (value) temp_model[key] = value;
      }
    }
    temp_model['club_id'] = registration.club_id;
    this.model = temp_model;
    this.disableFormValidation(player);
  }

  disableFormValidation(player) {
    let validate_fields_arr = player.validated_fields.split('|');
    setTimeout(() => {
      //loop to disable if it in validated_fields
      for (let key in this.form.controls) {
        if (validate_fields_arr.includes(key)) {
          this.form.controls[key].disable();
        } else {
          this.form.controls[key].enable();
          setTimeout(() => {
            this.form.controls[key].setErrors({
              serverError: this._translateService.instant(
                'Please update this field'
              ),
            });
            this.form.controls[key].markAsTouched();
          }, 200);
        }
      }
      (this.form.controls as any).club_id?.disable();
    }, 10);
  }

  onUpdate() {
    let data = this.model;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    // show loading
    this._loadingService.show();
    // register new player
    this._registrationService
      .updatePlayer(
        data,
        this.registerParam.player.id,
        this._registrationService.selectedSeason['id']
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data) => {
          // show success message
          Swal.fire({
            title: 'Notification',
            // image Frame.png add as icon
            html:
              `<div class="text-center">
              <img src="assets/images/Frame.png" alt="Frame" width="200px" height="149px">
              <p class="text-center">` +
              data.message +
              `</p>
              </div>`,
            confirmButtonText: this._translateService.instant('OK'),
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          }).then((result) => {
            // redirect to registration page
            // this._router.navigate(["/registration/select-player"]);
            this.eventUpdatePlayer.emit();
            this.toggleSidebar();
          });
        },
        (error) => {
          // show error message
          let errors = error.errors;
          this.setServerErr(errors);
          // check length of array
          if (errors == undefined || errors.length == 0) {
            // show error message
            Swal.fire({
              title: 'Error',
              text: error.message,
              icon: 'error',
              confirmButtonText: this._translateService.instant('OK'),
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            });
          }
        }
      );
  }

  getAllClubsIsActive() {
    this.clubs = this._registrationService.allClubs;
    // find field has key is club_id in fields
    let clubId = this.fields.find((item) => item.key == 'club_id');
    if (clubId) {
      clubId.props.options = this.clubs.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }
  }

  toggleSidebar(): void {
    this._coreSidebarService
      .getSidebarRegistry('register-new-player')
      .toggleOpen();
  }

  resetForm() {
    this.model = {};
    this.form.reset(this.model);
    this.formDirective.resetForm();
    // enable all fields
    for (let key in this.form.controls) {
      this.form.controls[key].enable();
    }
  }

  unlistener: () => void;

  ngAfterViewInit(): void {
    this.unlistener = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('suitableGroup')) {
        // dismiss all Swal
        Swal.close();
        this.openSuitableGroupModal();
      }
    });
  }

  setServerErr(errors) {
    for (let key in errors) {
      if (errors.hasOwnProperty(key)) {
        this.form.controls[key].setErrors({
          serverError: errors[key][0],
        });
      }
    }
  }

  ngOnDestroy() {
    this.unlistener();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.eventUpdatePlayer.unsubscribe();
    this.overlayClickEvent.unsubscribe();
    this.onOpenEvent.unsubscribe();
  }
}
