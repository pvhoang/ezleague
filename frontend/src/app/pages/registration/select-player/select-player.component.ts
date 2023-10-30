import { ClubService } from './../../../services/club.service';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from 'app/services/loading.service';
import { Subject } from 'rxjs';
import { RegistrationService } from './../../../services/registration.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { EventEmitter } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { AppConfig } from 'app/app-config';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from 'app/services/settings.service';
import { StripeCheckoutComponent } from 'app/components/stripe-checkout/stripe-checkout.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-select-player',
  templateUrl: './select-player.component.html',
  styleUrls: ['./select-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectPlayerComponent implements OnInit {
  // public variables
  is_validate_required = true;
  public contentHeader: object;
  public players = [];
  public clubs = [];
  public season: any;
  public appConfig = AppConfig;
  public currentPlayer: any = { player: {}, updated: true };

  public eventUpdatePlayer = new EventEmitter();
  PAYMENT_DETAIL_TYPES = AppConfig.PAYMENT_DETAIL_TYPES;
  PAYMENT_STATUS_PAID = AppConfig.PAYMENT_STATUS_PAID;
  // private variables
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _router: Router,
    private _registrationService: RegistrationService,
    private _loadingService: LoadingService,
    private _coreSidebarService: CoreSidebarService,
    public _translateService: TranslateService,
    public _modalService: NgbModal,
    public _settingsService: SettingsService
  ) {
    console.log(
      'RegisterNewPlayerComponent',
      _settingsService.initSettingsValue
    );
    if (
      _settingsService.initSettingsValue &&
      _settingsService.initSettingsValue.hasOwnProperty('is_validate_required')
    ) {
      this.is_validate_required =
        _settingsService.initSettingsValue.is_validate_required;
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: `Player List`,
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
            name: `${this._registrationService.selectedSeason['type']} ${this._registrationService.selectedSeason['name']}`,
            isLink: false,
          },
          {
            name: 'Player List',
            isLink: false,
          },
        ],
      },
    };

    this.season = this._registrationService.selectedSeason;

    // define default values for unsubscribe all
    this._unsubscribeAll = new Subject();

    // get players of this season
    this.getAllPlayers();

    // listen to event update player
    this.eventUpdatePlayer.subscribe(() => {
      this.getAllPlayers();
      this.currentPlayer.updated = false;
      this.currentPlayer.player = {};
    });
  }

  openRegisterNewPlayer() {
    this.currentPlayer.updated = false;
    this.currentPlayer.player = {};
    this._coreSidebarService
      .getSidebarRegistry('register-new-player')
      .toggleOpen();
  }

  selectPlayer(player) {
    // if validate status is not awaiting update, then return
    if (player.validate_status !== AppConfig.VALIDATE_STATUS.AwaitingUpdate) {
      Swal.fire({
        title: this._translateService.instant('Warning'),
        text: this._translateService.instant(
          'Only player with status "Awaiting Update" can be update'
        ),
        icon: 'warning',
        confirmButtonText: this._translateService.instant('OK'),
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }
    this.currentPlayer.player = player;
    this.currentPlayer.updated = true;
    // passing data to sidebar registrty
    this._coreSidebarService
      .getSidebarRegistry('register-new-player')
      .toggleOpen();
  }

  // get players of this season
  getAllPlayers() {
    this._loadingService.show();
    this._registrationService
      .getAllPlayers()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data) => {
          this.players = data['players'];
          // find registrations of this season
          this.players.forEach((player) => {
            let nearestRegis = player.registrations.find(
              (reg) =>
                reg.season_id == this._registrationService.selectedSeason['id']
            );
            if (nearestRegis) {
              player.nearestRegis = nearestRegis;
            } else {
              player.nearestRegis = player.registrations[0];
            }
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: this._translateService.instant('OK'),
          });
        }
      );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    // detroy eventUpdatePlayer
    this.eventUpdatePlayer.unsubscribe();
  }

  // check if player is registered
  checkRegistration(registrations) {
    // check in array of registrations have item = selected season
    let result = registrations.find(
      (registration) =>
        registration.season_id === this._registrationService.selectedSeason.id
    );
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  onError($event) {
    $event.target.src = 'assets/images/logo/ezactive_1024x1024.png';
  }

  getBadgeValidation(status) {
    switch (status) {
      case AppConfig.VALIDATE_STATUS.Pending:
        return 'badge-light-info';
      case AppConfig.VALIDATE_STATUS.AwaitingUpdate:
        return 'badge-light-danger';
      case AppConfig.VALIDATE_STATUS.Updated:
        return 'badge-light-warning';
      case AppConfig.VALIDATE_STATUS.Validated:
        return 'badge-light-success';
      default:
        return 'badge-light-secondary';
    }
  }

  payment(player, registration_id, paymentDetail = null) {
    console.log('player: ', player);
    console.log('selectedSeason: ', this.season);
    console.log('paymentDetail: ', paymentDetail);

    if (
      paymentDetail &&
      paymentDetail.payment &&
      paymentDetail.payment.payment_url
    ) {
      // open payment url in new tab
      window.open(paymentDetail.payment.payment_url, '_blank');
      return;
    }
    // Define modal payment
    let modalRef = this._modalService.open(StripeCheckoutComponent, {
      size: 'sm',
      centered: true,
      backdrop: 'static',
    });
    let description = `${player.user.first_name} ${player.user.last_name} pay for season ${this.season.name}`;
    modalRef.componentInstance.closeOnSuccess = true;
    modalRef.componentInstance.products = [
      {
        name: description,
        quantity: 1,
        price: this.season.fee,
      },
    ];
    modalRef.componentInstance.description = description;
    modalRef.componentInstance.api_checkout = `${environment.apiUrl}/stripe/checkout`;
    modalRef.componentInstance.onSucceeded.subscribe((response) => {
      console.log('onSucceeded: ', response.data);
      let data = response.data;
      let formData = new FormData();
      formData.append('payment_intent', data.id);
      formData.append('payment_status', data.status);
      formData.append('fee', data.amount);
      formData.append('registration_id', registration_id);
      this._registrationService.storePayment(formData).subscribe((data) => {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: this._translateService.instant('OK'),
        });
        this.getAllPlayers();
      });
    });
  }

  getBadgeRegistration(status) {
    switch (status) {
      case AppConfig.APPROVE_STATUS.Registered:
        return 'badge-light-info';
      case AppConfig.APPROVE_STATUS.Rejected:
        return 'badge-light-danger';
      case AppConfig.APPROVE_STATUS.Approved:
        return 'badge-light-success';
      default:
        return 'badge-light-secondary';
    }
  }
}
