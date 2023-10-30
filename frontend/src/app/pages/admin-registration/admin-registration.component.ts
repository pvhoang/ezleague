import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'app/app-config';
import { CommonsService } from 'app/services/commons.service';
import { RegistrationService } from 'app/services/registration.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorComponent } from './validator/validator.component';
import { DataTableDirective } from 'angular-datatables';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ClubService } from 'app/services/club.service';
import { LoadingService } from 'app/services/loading.service';
import { Season } from 'app/interfaces/season';
import { SeasonService } from 'app/services/season.service';
import { Subject, Subscription } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import moment from 'moment';
import { SettingsService } from 'app/services/settings.service';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.scss'],
})
export class AdminRegistrationComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  public contentHeader: object;
  seasons: Season[] = [];
  season: Season;
  seasonId: number = 0;
  @ViewChild('modalValidator') modalValidator: TemplateRef<any>;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  table_name = 'registration_table';
  params: any = {
    editor_id: this.table_name,
    title: {
      create: 'Create new registration',
      edit: 'Edit registration',
      remove: 'Delete registration',
    },
    url: `${environment.apiUrl}/registrations/editor`,
    method: 'POST',
    action: 'create',
  };
  public fields: any[] = [
    {
      key: 'club_id',
      type: 'select',
      props: {
        label: this._translateService.instant('Edit club'),
        placeholder: this._translateService.instant('Select Club'),
        required: true,

        // selected club
        valueProp: 'id',
        labelProp: 'name',
        options: [
          {
            id: 1,
            name: 'Loading...',
          },
        ],
      },
      //selected club
      defaultValue: 1,
      className: '',
    },
  ];
  customFields: any[] = [];
  initSettings: any = {};
  is_validate_required: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _registrationService: RegistrationService,
    public _translateService: TranslateService,
    public modalService: NgbModal,
    public seasonService: SeasonService,
    public _clubService: ClubService,
    public _loadingService: LoadingService,
    public _coreSidebarService: CoreSidebarService,
    public _commonsService: CommonsService,
    public _settingsService: SettingsService
  ) {}
  subscriptions: Subscription[] = [];
  ngOnInit(): void {
    $.fx.off = true; //this is for disable jquery animation
    this.setContentHeader();
    this.subscriptions.push(
      this._settingsService.customFields.subscribe((customFields) => {
        this.customFields = customFields;
      })
    );

    this._settingsService.getCustomFields();

    this.getActiveSeasons();
  }

  convertCustomFields2Columns(defaultColumns: any[]) {
    let columns: any[] = [];
    let inogreColumns = [
      'photo',
      'first_name',
      'last_name',
      'club_id',
      'document_photo',
    ];
    this.customFields.forEach((customField) => {
      //filter if defaultColumns.data == customField.key => skip
      let isExist = defaultColumns.filter((defaultColumn) => {
        return defaultColumn.data == customField.key;
      });
      if (isExist.length > 0 || inogreColumns.indexOf(customField.key) > -1) {
        return;
      }
      columns.push({
        data: null,
        title: customField.props.label,
        visible: false,
        render: function (data: any, type: any, row: any) {
          if (data.hasOwnProperty(customField.key)) {
            let value = data[customField.key];
            if (!value) {
              return '';
            }
            return data[customField.key];
          } else {
            if (
              data.custom_fields &&
              data.custom_fields.hasOwnProperty(customField.key)
            ) {
              let value = data.custom_fields[customField.key];
              if (!value) {
                return '';
              }
              return value;
            } else return '';
          }
        },
      });
    });

    // merge columns and defaultColumns
    columns = [...defaultColumns, ...columns];
    return columns;
  }

  initDatatable() {
    let defaultColumns = [
      {
        sortable: false,
        data: 'photo',
        title: this._translateService.instant('Photo'),
        render: function (data: any, type: any, row: any) {
          //create image
          let img = document.createElement('img');
          img.src = data;
          img.id = `img-${row.id}`;
          img.style.width = '50px';
          img.style.height = 'auto';
          img.style.objectFit = 'cover';
          img.style.backgroundColor = '#fff';
          img.style.objectFit = 'cover';
          if (data == null) {
            img.src = 'assets/images/logo/ezactive_1024x1024.png';
          }
          // check get image error
          img.onerror = function () {
            img.src = 'assets/images/logo/ezactive_1024x1024.png';
            // set src by row id
            $(`#img-${row.id}`).attr('src', img.src);
          };
          return img.outerHTML;
        },
      },
      {
        data: null,
        title: this._translateService.instant('Player'),
        className: 'font-weight-bolder',
        render: function (data: any, type: any, row: any) {
          if (row.first_name == null || row.last_name == null) {
            return `<a>${row.first_name} ${row.last_name}</a>`;
          }
          return `${row.first_name} ${row.last_name}`;
        },
      },
      {
        data: 'dob',
        title: this._translateService.instant('Date of birth'),
        render: function (data: any, type: any, row: any) {
          if (data == null) {
            return ``;
          }
          return `${data}`;
        },
      },
      {
        data: 'gender',
        title: this._translateService.instant('Gender'),
        render: (data: any, type: any, row: any) => {
          if (data) {
            return data == 'Male'
              ? this._translateService.instant('Male')
              : this._translateService.instant('Female');
          } else {
            return ``;
          }
        },
      },
      {
        data: 'guardian_first_name',
        title: this._translateService.instant('Parent name'),
        visible: false,
        render: (data: any, type: any, row: any) => {
          if (data == null) {
            return ``;
          }
          return `${data} ${row.guardian_last_name}`;
        },
      },
      {
        data: 'guardian_email',
        title: this._translateService.instant('Parent email'),
        visible: false,
      },
      {
        data: 'club_name',
        title: this._translateService.instant('Club'),
      },
      {
        data: 'registered_date',
        title: this._translateService.instant('Reg_Date'),
        render(data: any, type: any, row: any) {
          if (data) {
            return moment(data).format('YYYY-MM-DD HH:mm:ss');
          }
        },
      },
      {
        data: null,
        visible: false,
        title: this._translateService.instant('App_Date'),
        render(data: any, type: any, row: any) {
          if (row.hasOwnProperty('approved_date') && row.approved_date) {
            return moment(row.approved_date).format('YYYY-MM-DD HH:mm:ss');
          } else {
            return '';
          }
        },
      },
      {
        data: 'approval_status',
        title: this._translateService.instant('Approval Status'),
        render: (data: any, type: any, row: any) => {
          let registered_text = this._translateService.instant('Registered');
          let approved_text = this._translateService.instant('Approved');
          let rejected_text = this._translateService.instant('Rejected');
          if (data == null) {
            return ``;
          }
          switch (data) {
            case AppConfig.APPROVE_STATUS.Registered:
              return `<span class="badge badge-light-info">${registered_text}</span>`;
            case AppConfig.APPROVE_STATUS.Approved:
              return `<span class="badge badge-light-success">${approved_text}</span>`;
            case AppConfig.APPROVE_STATUS.Rejected:
              return `<span class="badge badge-light-danger">${rejected_text}</span>`;
            default:
              return `<span class="badge badge-light-secondary">${data.toUpperCase()}</span>`;
          }
        },
      },
      {
        data: 'payment_status',
        title: this._translateService.instant('Payment Status'),
        visible: false,
        render: (data: any, type: any, row: any) => {
          if (data == null)
            return `<span class="badge badge-light-secondary">${this._translateService.instant(
              'No invoice'
            )}</span>`;
          switch (data) {
            case AppConfig.PAYMENT_STATUS.succeeded:
            case AppConfig.PAYMENT_STATUS.paid:
              return `<span class="badge badge-light-success">${this._translateService.instant(
                'Paid'
              )}</span>`;
            case AppConfig.PAYMENT_STATUS.open:
              return `<span class="badge badge-light-warning">${this._translateService.instant(
                'Sent'
              )}</span>`;
            case AppConfig.PAYMENT_STATUS.failed:
              return `<span class="badge badge-light-danger">${this._translateService.instant(
                'Failed'
              )}</span>`;
            default:
              return `<span class="badge badge-light-secondary">${data}</span>`;
          }
        },
      },
    ];
    if (this.is_validate_required) {
      defaultColumns.push({
        data: 'validate_status',
        title: this._translateService.instant('Validation Status'),
        render: (data: any, type: any, row: any) => {
          let pending_text = this._translateService.instant('Pending');
          let awaiting_text = this._translateService.instant('Awaiting Update');
          let updated_text = this._translateService.instant('Updated');
          let validated_text = this._translateService.instant('Validated');
          if (data == null) {
            return ``;
          }

          switch (data) {
            case AppConfig.VALIDATE_STATUS.Pending:
              return `<span class="badge badge-light-info">${pending_text}</span>`;
            case AppConfig.VALIDATE_STATUS.AwaitingUpdate:
              return `<span class="badge badge-light-danger">${awaiting_text}</span>`;
            case AppConfig.VALIDATE_STATUS.Updated:
              return `<span class="badge badge-light-warning">${updated_text}</span>`;
            case AppConfig.VALIDATE_STATUS.Validated:
              return `<span class="badge badge-light-success">${validated_text}</span>`;
            default:
              return `<span class="badge badge-light-secondary">${data.toUpperCase()}</span>`;
          }
        },
      });
    }
    defaultColumns = this.convertCustomFields2Columns(defaultColumns);
    let buttons: any = [
      {
        // drop down button
        extend: 'collection',
        background: false,
        text: this._translateService.instant('Action'),
        className: 'action-button',
        buttons: [
          {
            text: `<i class="fa-duotone fa-check-double"></i> ${this._translateService.instant(
              'Approve full'
            )}`,
            extend: 'selectedSingle',
            className: 'action-button-item approve-button',
            action: (e: any, dt: any, node: any, config: any) => {
              this._loadingService.show();
              let data = dt.row({ selected: true }).data();
              this._registrationService.approve(data.id).subscribe(
                (res) => {
                  Swal.fire({
                    title: this._translateService.instant('Success'),
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: this._translateService.instant('OK'),
                    customClass: {
                      confirmButton: 'btn btn-primary',
                    },
                  });
                  this.dtElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.ajax.reload();
                    }
                  );
                },
                (err) => {
                  Swal.fire({
                    title: this._translateService.instant('Error'),
                    text: err.message,
                    icon: 'error',
                    confirmButtonText: this._translateService.instant('OK'),
                    customClass: {
                      confirmButton: 'btn btn-primary',
                    },
                  });
                }
              );
            },
          },
          {
            text: `<i class="fa-regular fa-rotate"></i> ${this._translateService.instant(
              'Sync Payment Status'
            )}`,
            className: 'action-button-item approve-button',
            action: (e: any, dt: any, node: any, config: any) => {
              this._loadingService.show();
              this._registrationService
                .syncPaymentStatusStripeBySeason(this.seasonId)
                .subscribe((res) => {
                  Swal.fire({
                    title: this._translateService.instant('Success'),
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: this._translateService.instant('OK'),
                    customClass: {
                      confirmButton: 'btn btn-primary',
                    },
                  });
                  this.dtElement.dtInstance.then(
                    (dtInstance: DataTables.Api) => {
                      dtInstance.ajax.reload();
                    }
                  );
                });
            },
          },
        ],
      },
      {
        text:
          '<i class="fas fa-edit mr-1"></i> ' +
          this._translateService.instant('Edit'),
        titleAttr: this._translateService.instant('Edit'),
        action: (e, dt, node, config) => {
          let selectedRows = dt.rows({ selected: true }).data();

          if (selectedRows.length == 0) {
            Swal.fire({
              title: 'Please select at least one player',
              icon: 'warning',
            });
            return;
          }

          this.editor('edit', selectedRows[0]);
        },
        extend: 'selected',
      },
      {
        // column
        extend: 'colvis',
        text: this._translateService.instant('Column'),
      },
    ];

    if (this.is_validate_required) {
      // add validate button to index 1
      buttons.splice(1, 0, {
        // Validate button
        text:
          '<i class="fa-duotone fa-check-double"></i> ' +
          this._translateService.instant('Validate'),
        action: (e, dt, node, config) => {
          let selectedRows = dt.rows({ selected: true }).data();

          let registrations = [];
          selectedRows.each((row) => {
            registrations.push(row);
          });
          let data = {
            registrations: registrations,
            status: selectedRows[0].validate_status,
          };

          if (
            data.status == AppConfig.VALIDATE_STATUS.Updated ||
            data.status == AppConfig.VALIDATE_STATUS.Pending
          ) {
            this.modalValidatorOpen(data);
          } else {
            Swal.fire({
              title: this._translateService.instant(
                'Only "Updated" and "Pending" status can be validate'
              ),
              icon: 'warning',
            });
          }
        },
        extend: 'selected',
      });
    }

    this.dtOptions = {
      dom: this._commonsService.dataTableDefaults.dom,
      select: 'single',
      // serverSide: true,
      rowId: 'id',
      ajax: (dataTablesParameters: any, callback) => {
        // add season id
        dataTablesParameters['season_id'] = this.seasonId;
        this._http
          .post<any>(
            `${environment.apiUrl}/registrations/all`,
            dataTablesParameters
          )
          .subscribe((resp: any) => {
            this._loadingService.dismiss();
            callback({
              // this function callback is used to return data to datatable
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
            });
          });
      },
      order: [8, 'desc'],
      responsive: true,
      scrollX: false,
      language: this._commonsService.dataTableDefaults.lang,
      // columnDefs: [{ className: "text-center", targets: "_all" }],
      columns: defaultColumns,
      buttons: {
        dom: this._commonsService.dataTableDefaults.buttons.dom,
        buttons: buttons,
      },
    };
  }

  setContentHeader() {
    this.contentHeader = {
      headerTitle: this._translateService.instant('Admin Registration'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._translateService.instant('Admin Registration'),
            isLink: false,
          },
        ],
      },
    };
  }

  getActiveSeasons() {
    let status = 'active';
    this.seasonService.getSeasons(status).subscribe(
      (data) => {
        this.seasons = data;
        this.season = this.seasons[0];
        this.seasonId = this.season.id;
        if (
          this._settingsService.initSettingsValue &&
          this._settingsService.initSettingsValue.hasOwnProperty(
            'is_validate_required'
          )
        ) {
          this.is_validate_required =
            this._settingsService.initSettingsValue.is_validate_required;
        }
        this.initDatatable();
        this.dtTrigger.next(this.dtOptions);
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: this._translateService.instant('OK'),
        });
      }
    );
  }

  onChangeSeason($event) {
    console.log('onChangeSeason', $event);
    this.season = $event;
    this.seasonId = this.season.id;
    this.reloadDataTable();
  }

  reloadDataTable(): void {
    this._loadingService.show();
    console.log('reloadDataTable');
    if (this.dtElement && this.dtElement.dtInstance)
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload();
      });
  }

  modalValidatorOpen(data) {
    const modalRef = this.modalService.open(ValidatorComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
    });

    modalRef.componentInstance.registrations = data.registrations[0];
    modalRef.componentInstance.status = data.status;
    modalRef.componentInstance.dtElement = this.dtElement;

    //    let registration_id = data.registrations[0].id;

    // modalRef.result.then(
    //   (result) => {
    //     this._registrationService.validateRegistration(registration_id,result).toPromise().then((data) => {
    //       console.log('data', data);
    //       this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //         dtInstance.ajax.reload();
    //       });
    //     });
    //   }
    // );
  }

  showClubName(row) {
    return new Promise((resolve, reject) => {
      let selectedValidateStatus = row.validate_status;
      let selectedClub = row.club_id;
      this.getAllClubsIsActive().then((data) => {
        this.fields.forEach((field) => {
          if (field.key == 'club_id') {
            field.templateOptions.options = data;
            field.defaultValue = selectedClub;
            resolve(true);
          }
        });
      });
    });
  }

  getAllClubsIsActive() {
    return new Promise((resolve, reject) => {
      this._clubService
        .getAllClubsIsActive()
        .toPromise()
        .then((data) => {
          resolve(data);
        });
    });
  }

  editor(action, row) {
    this.params.action = action;
    this.params.row = row ? row : null;
    this.showClubName(row).then((data) => {
      if (data) {
        this._coreSidebarService
          .getSidebarRegistry(this.table_name)
          .toggleOpen();
      }
    });
  }

  getSeason(id) {
    return new Promise((resolve, reject) => {
      this._registrationService.getSeasonByID(id).subscribe((data) => {
        resolve(data);
      });
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
