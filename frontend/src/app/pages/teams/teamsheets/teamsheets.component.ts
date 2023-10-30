import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { Season } from 'app/interfaces/season';
import { AuthService } from 'app/services/auth.service';
import { ClubService } from 'app/services/club.service';
import { CommonsService } from 'app/services/commons.service';
import { LoadingService } from 'app/services/loading.service';
import { SeasonService } from 'app/services/season.service';
import { TeamService } from 'app/services/team.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalTeamsheetHistoryComponent } from './modal-teamsheet-history/modal-teamsheet-history.component';
import moment from 'moment';
@Component({
  selector: 'app-teamsheets',
  templateUrl: './teamsheets.component.html',
  styleUrls: ['./teamsheets.component.scss'],
})
export class TeamSheetsComponent implements AfterViewInit, OnDestroy, OnInit {
  seasons: Season[] = [];
  season: Season;
  selectedClub: any;
  selectedGroup: any;
  clubFilter: any;
  seasonId: number = 0;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  public modalRef: any;
  public contentHeader: object;

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _http: HttpClient,
    public teamService: TeamService,
    public seasonService: SeasonService,
    public _clubService: ClubService,
    public _commonsService: CommonsService,
    public _loadingService: LoadingService,
    public _authService: AuthService,
    public renderer: Renderer2,
    public _modalService: NgbModal,
    private _translateService: TranslateService
  ) {
    // this.seasonId = this._route.snapshot.paramMap.get('seasonId');
    console.log('current User', this._authService.currentUserValue);
  }

  clubs:
    | [
        {
          id: number;
          name: string;
          code: string;
          groups: [];
        }
      ]
    | any = [];

  groups = [];

  teams = [];

  openPlayerModal(team) {
    let teamId = team.id;
    let seasonId = this.seasonId;

    let clubId = team.club.id;
    let groupId = team.group.id;

    setTimeout(() => {
      this._router.navigate(
        ['team/seasons/', seasonId, 'teams', teamId, 'players'],
        { queryParams: { clubId: clubId, groupId: groupId } }
      );
    }, 500);
  }

  getTeam() {
    this._loadingService.show();
    this.teamService
      .getTeamInSeason2Manage(this.seasonId)
      .toPromise()
      .then((res: any) => {
        console.log('res', res);
        this.teams = res.data;
        // divide into groups by club
        this.teams.forEach((team) => {
          // if team.club.id is not in clubs
          if (!this.clubs.find((club) => club.id === team.club.id)) {
            this.clubs.push(team.club);
            this.clubs[this.clubs.length - 1].groups = [];
          }
          // add group to club if not exist in club
          let club = this.clubs.find((club) => club.id === team.club.id);
          if (!club.groups.find((group) => group.id === team.group.id)) {
            club.groups.push(team.group);
            club.groups[club.groups.length - 1].teams = [];
          }
        });
        // set selected club
        this.clubFilter = this.clubs[0].id;
        this.selectedClub = this.clubs[0];
        this.groups = this.clubs[0].groups;
        this.selectedGroup = this.clubs[0].groups[0].id;
      });
  }

  getTeamById(id) {
    return this.teams.find((team) => team.id === id);
  }

  ngOnInit(): void {
    this.setContentHeader();
    this.getActiveSeasons();
    this.initDatatables();
    // await this.getTeam();
  }

  setContentHeader() {
    this.contentHeader = {
      headerTitle: this._translateService.instant('Teamsheets'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._translateService.instant('Teams'),
            isLink: false,
          },
          {
            name: this._translateService.instant('Teamsheets'),
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
        console.log(`getActiveSeasons`, data);
        this.seasons = data;
        this.season = this.seasons[0];
        this.seasonId = this.season.id;
        this.rerenderDataTable();
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
    this.rerenderDataTable();
  }

  initDatatables() {
    this.dtOptions = {
      dom: this._commonsService.dataTableDefaults.dom,
      ajax: (dataTablesParameters: any, callback) => {
        this._http
          .post<any>(
            `${environment.apiUrl}/seasons/${this.seasonId}/teamsheets`,
            dataTablesParameters
          )
          .subscribe((resp: any) => {
            let data = resp.data;
            // show table the latest team sheet by team id
            const groupByTeamId = data.reduce((prev, current) => {
              if (prev[current.team_id]) {
                if (
                  new Date(current.updated_at) >
                  new Date(prev[current.team_id].updated_at)
                ) {
                  prev[current.team_id] = current;
                }
              } else {
                prev[current.team_id] = current;
              }
              return prev;
            }, {});

            const mappedData = Object.values(groupByTeamId);
            console.log('mappedData', mappedData);

            callback({
              // this function callback is used to return data to datatable
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: mappedData,
            });
          });
      },

      // data: this.teamSheetData,

      select: 'single',
      // serverSide: true,
      rowId: 'id',
      // fake data
      responsive: true,
      scrollX: false,
      language: this._commonsService.dataTableDefaults.lang,
      columnDefs: [
        { responsivePriority: 1, targets: -1 },
        { responsivePriority: 1, targets: -2 },
        { responsivePriority: 2, targets: 2 },
      ],
      columns: [
        {
          data: 'team.club.name',
        },
        {
          data: 'team.group.name',
        },
        {
          data: 'team.name',
        },
        {
          data: 'document',
          render: (data, type, row) => {
            // open pdf button
            return (
              ` <a href="` +
              data +
              `" target="_blank" class="btn btn-primary btn-sm">${this._translateService.instant(
                'Open'
              )}</a> `
            );
          },
        },
        {
          data: 'created_at',
          render: (data, type, row) => {
            return moment(data).format('YYYY-MM-DD HH:mm:ss');
          },
        },
        {
          data: 'team.id',
          render: (data, type, row) => {
            let label = 'Unlocked';
            if (row.is_locked) {
              label = 'Locked';
            }
            // toggle button
            return (
              ` <div class="custom-control custom-switch custom-switch-danger">
            ` +
              label +
              `<br>
            <input type="checkbox" class=" custom-control-input" id="customSwitch` +
              row.id +
              `" check-row-id=` +
              row.id +
              `  check-row="` +
              data +
              `" ` +
              (row.is_locked === 1 ? 'checked' : '') +
              `>
            <label class="custom-control-label" for="customSwitch` +
              row.id +
              `">
              <span class="switch-icon-left"><i data-feather="check"></i></span>
              <span class="switch-icon-right"><i data-feather="x"></i></span>
            </label>
          </div>
                `
            );
          },
        },
        {
          data: 'team.id',
          render: (data, type, row) => {
            // edit button
            return (
              ` <button class="btn btn-outline-primary btn-sm" team-id="` +
              data +
              `"  >
            ` +
              this._translateService.instant('View Archived') +
              `
            </button> `
            );
          },
        },
      ],
      buttons: {
        dom: this._commonsService.dataTableDefaults.buttons.dom,
        buttons: [
          {
            extend: 'colvis',
            text:
              '<i class="feather icon-eye"></i> ' +
              this._translateService.instant('Column'),
          },
        ],
      },
    };
  }

  rerenderDataTable(): void {
    console.log('rerenderDataTable');
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  onSelectedClubChange(event) {
    // console.log('onSelectedClubChange', event);
    if (event) {
      this.clubFilter = event.id;
      this.groups = event.groups;
      this.selectedGroup = this.groups[0].id;
    } else {
      this.clubFilter = null;
      this.groups = [];
      this.selectedGroup = null;
    }
  }
  private unlistener: () => void;

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.unlistener = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('team-id')) {
        let teamId = event.target.getAttribute('team-id');
        console.log('teamId', teamId);

        const modalRef = this._modalService.open(
          ModalTeamsheetHistoryComponent,
          {
            size: 'lg',
            centered: true,
            backdrop: 'static',
            keyboard: false,
            windowClass: 'modal-xxl',
          }
        );

        modalRef.componentInstance.teamId = teamId;
      }

      if (event.target.hasAttribute('check-row')) {
        if (this._authService.isAdmin()) {
          let row_id = event.target.getAttribute('check-row-id');
          let team_id = event.target.getAttribute('check-row');
          console.log('team_id', team_id);
          console.log('event.target.checked', event.target.checked);

          let is_locked = event.target.checked ? '1' : '0';
          console.log('is_locked', is_locked);

          let params: FormData = new FormData();
          params.append('action', 'edit');
          params.append(`data[${row_id}][team_id]`, team_id);
          params.append(`data[${row_id}][is_locked]`, is_locked);
          console.log('params', params.getAll(`data[${row_id}][is_locked]`));

          this.editor(params);

          // reload table
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
          });
        } else {
          event.target.checked = !event.target.checked;
          Swal.fire({
            icon: 'warning',
            title: this._translateService.instant('Warning'),
            text: this._translateService.instant(
              'Only admin can lock or unlock team sheet'
            ),
          });
        }
      }
    });
  }

  // editor lock or unlock
  editor(params) {
    this.teamService.editorTeamSheet(params).subscribe((resp: any) => {
      console.log('resp', resp);
      if (resp.status == 'success') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.ajax.reload();
        });
      } else {
      }
    });
  }

  ngOnDestroy(): void {
    this.unlistener();
    this.dtTrigger.unsubscribe();
  }
}
