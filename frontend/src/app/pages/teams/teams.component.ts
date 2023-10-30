import { ClubService } from '../../services/club.service';
import { LoadingService } from '../../services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RegistrationService } from '../../services/registration.service';
import { Router } from '@angular/router';
import { Component, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SeasonService } from 'app/services/season.service';
import { Season } from 'app/interfaces/season';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TeamsComponent {
  // public variables
  public contentHeader: object;
  seasons: Season[] = [];
  public currentSeasons;

  // private variables
  private _unsubscribeAll: Subject<any>;
  private _clubs = [];

  constructor(
    private _router: Router,
    private _registrationService: RegistrationService,
    private _loadingService: LoadingService,
    private _translateService: TranslateService,
    private seasonService: SeasonService,
    private _clubService: ClubService,
    private _trans: TranslateService
  ) {}

  ngOnInit(): void {
    // content header
    this.contentHeader = {
      headerTitle: this._trans.instant('Select Season'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Team',
            isLink: false,
          },
          {
            name: this._trans.instant('Assign player'),
            isLink: false,
          },
          {
            name: 'Select Season',
            isLink: false,
          },
        ],
      },
    };

    // define default values for unsubscribe all
    this._unsubscribeAll = new Subject();

    // get active seasons
    this.getActiveSeasons();

    // get all clubs
    this.getAllClubsIsActive();
  }

  openRegistrationModal(season) {
    this._registrationService.selectedSeason = season;
    // navigate to select-player
    setTimeout(() => {
      this._router.navigate(['team/seasons/', season.id, 'teams']);
    }, 500);
  }

  getActiveSeasons() {
    let status = 'active';
    this.seasonService.getSeasons(status).subscribe(
      (data) => {
        console.log(`getActiveSeasons`, data);
        this.seasons = data;
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

  getAllClubsIsActive() {
    // get all clubs
    this._clubService
      .getAllClubsIsActive()
      .toPromise()
      .then(
        (data) => {
          // set data to clubs
          this._clubs = data;
          // set data to allClubs
          this._registrationService.allClubs = data;
        },
        (error) => {
          // show error
          Swal.fire({
            title: 'Error',
            text: error.message,
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
  }
}
