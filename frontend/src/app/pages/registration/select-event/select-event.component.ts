import { ClubService } from './../../../services/club.service';
import { LoadingService } from "./../../../services/loading.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { RegistrationService } from "./../../../services/registration.service";
import { Router } from "@angular/router";
import { Component, ViewEncapsulation } from "@angular/core";
// import conten
import Swal from "sweetalert2";

@Component({
  selector: "app-select-event",
  templateUrl: "./select-event.component.html",
  styleUrls: ["./select-event.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SelectEventComponent {
  // public variables
  public contentHeader: object;
  public currentSeasons;

  // private variables
  private _unsubscribeAll: Subject<any>;
  private _clubs = [];

  constructor(
    private _router: Router,
    private _registrationService: RegistrationService,
    private _loadingService: LoadingService,
    private _clubService: ClubService
  ) {}

  ngOnInit(): void {
    // content header
    this.contentHeader = {
      headerTitle: "Select Season",
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Registration',
            isLink: false,
          },
          {
            name: 'Select Season',
            isLink: false,
          },
        ]
      }
    };

    // define default values for unsubscribe all
    this._unsubscribeAll = new Subject();

    // get current seasons
    this._getCurrentSeason();

    // get all clubs
    this.getAllClubsIsActive();
  }

  openTeamListModal(season) {
    this._registrationService.selectedSeason = season;
    // navigate to select-player
    setTimeout(() => {
      this._router.navigate(["registration/season/", season.id, "select-player"]);
    }, 500);
  }

  _getCurrentSeason() {
    this._loadingService.show();
    this._registrationService
      .getCurrentSeason()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data) => {
          this.currentSeasons = data;
        },
        (error) => {
          Swal.fire({ 
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
  }

  getAllClubsIsActive() {
    // get all clubs
    this._clubService
      .getAllClubsIsActive().toPromise()
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
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
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
