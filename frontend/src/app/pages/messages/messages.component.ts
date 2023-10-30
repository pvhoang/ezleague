import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { AppConfig } from 'app/app-config';
import { CommonsService } from 'app/services/commons.service';
import { SeasonService } from 'app/services/season.service';
import { environment } from 'environments/environment';
import moment from 'moment';
import { Observable, Subject, of } from 'rxjs';
import config from './../../../../capacitor.config';
import { group } from '@angular/animations';
import { ClubService } from 'app/services/club.service';
import { RegistrationService } from 'app/services/registration.service';
import { SendMessagesService } from 'app/services/send-messages.service';
import { AuthService } from 'app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessagesComponent implements OnInit {
  public contentHeader: object;
  constructor(
    public _registrationService: RegistrationService,
    public _sendMessageService: SendMessagesService,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public _seasonService: SeasonService,
    public _authService: AuthService,
    public _clubService: ClubService,
    public _modalService: NgbModal,
    private route: ActivatedRoute,
    public _render: Renderer2,
    public _http: HttpClient,
    public _router: Router
  ) {}
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  @ViewChild('modalForm') modalForm: any;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  private unlistener: () => void;
  season_id: any;
  modalRef: any;
  seasons = [];
  form = new FormGroup({});
  model: any = { type: 'email' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'type',
      type: 'radio',
      props: {
        label: this._translateService.instant('Type'),
        options: [
          { label: this._translateService.instant(AppConfig.SEND_MESSAGE_TYPES.email), value: 'email' },
          { label: this._translateService.instant(AppConfig.SEND_MESSAGE_TYPES.push_noti), value: 'push_noti' },
          {
            label: this._translateService.instant(AppConfig.SEND_MESSAGE_TYPES.email_push_noti),
            value: 'email_push_noti',
          },
        ],
        required: true,
      },
      defaultValue: AppConfig.SEND_MESSAGE_TYPES.email,
    },
    {
      key: 'send_to',
      type: 'radio',
      props: {
        label: this._translateService.instant('Send to'),
        options: [
          { label: this._translateService.instant('All'), value: 'all_users' },
          { label: this._translateService.instant('Players'), value: 'players' },
          // { label: 'Teams', value: 'teams' },
          { label: this._translateService.instant('Clubs'), value: 'clubs' },
          { label: this._translateService.instant('Groups'), value: 'groups' },
          { label: this._translateService.instant('Clubs & Groups'), value: 'clubs_groups' },
        ],
        required: true,
      },
    },

    {
      key: 'club_ids',
      type: 'ng-select',
      props: {
        label: this._translateService.instant('Send to clubs'),
        multiple: true,
        options: [],
      },
      expressions: {
        'props.required':
          'model.send_to == "clubs" || model.send_to == "clubs_groups"',
      },
      hideExpression:
        'model.send_to != "clubs" && model.send_to != "clubs_groups"',
    },
    {
      key: 'group_ids',
      type: 'ng-select',
      props: {
        label: this._translateService.instant('Send to groups'),
        multiple: true,
        options: [],
      },
      expressions: {
        'props.required':
          'model.send_to == "groups" || model.send_to == "clubs_groups"',
      },
      hideExpression:
        'model.send_to != "groups" && model.send_to != "clubs_groups"',
    },
    {
      key: 'player_ids',
      type: 'ng-select',
      props: {
        label: this._translateService.instant('Send to players'),
        multiple: true,
        options: [],
      },
      expressions: { 'props.required': 'model.send_to == "players"' },
      hideExpression: 'model.send_to != "players"',
    },
    {
      key: 'team_ids',
      type: 'ng-select',
      props: {
        label: this._translateService.instant('Send to teams'),
        multiple: true,
        options: [],
      },
      expressions: { 'props.required': 'model.send_to == "teams"' },
      hideExpression: 'model.send_to != "teams"',
    },
    {
      key: 'title',
      type: 'input',
      props: {
        label: this._translateService.instant('Title'),
        required: true,
      },
    },
    {
      key: 'content',
      type: 'ckeditor5',
      props: {
        required: true,
        label: this._translateService.instant('Content'),
        config: {
          simpleUpload: {
            // The URL that the images are uploaded to.
            uploadUrl: `${environment.apiUrl}/clubs/editor`,
          },
          placeholder: this._translateService.instant('Type the content here'),
          htmlSupport: {
            allow: [
              {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true,
              },
            ],
          },
          htmlEmbed: {
            showPreviews: true,
          },
          mention: {
            feeds: [
              {
                marker: '{',
                feed: this.getFeedItems,
                minimumCharacters: 1,
              },
            ],
          },
        },
      },
      defaultValue: '',
    },
    {
      key: 'attachments',
      type: 'file',
      props: {
        label: this._translateService.instant('Attachments'),
        upload_url: `${environment.apiUrl}/files/editor`,
        multiple: true,
      },
    },
  ];

  getFeedItems(queryText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const itemsToDisplay = [
          '{{user_first_name}}',
          '{{user_last_name}}',
          '{{user_email}}',
        ]
          .filter(isItemMatching)
          .slice(0, 10);

        resolve(itemsToDisplay);
      }, 100);
    });

    function isItemMatching(item) {
      const searchString = queryText.toLowerCase();
      return item.toLowerCase().includes(searchString);
      // ||        item.id.toLowerCase().includes(searchString)
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Messages',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/',
          },
          {
            name: 'Messages',
            isLink: false,
          },
        ],
      },
    };

    this.getSeasons();
  }
  getSeasons() {
    this._seasonService.getSeasons().subscribe((data) => {
      // console.log(data);
      this.seasons = data;
      this.season_id = data[0].id;
      this.preloadOptions();
      this.dtTrigger.next(this.dtOptions);
    });
  }

  // get groups in season
  getGroups(season_id) {
    this._seasonService.getGroupsBySeason(season_id).subscribe((data) => {
      let groups = data.map((group) => {
        return { label: group.name, value: group.id };
      });
      // find index of field key group_ids
      let index = this.fields.findIndex((field) => field.key == 'group_ids');
      // set options for field group_ids
      this.fields[index].props.options = groups;
    });
  }

  getPlayerRegisteredInSeason(season_id) {
    this._registrationService
      .getPlayerRegistered(season_id)
      .subscribe((data) => {
        let players = data.map((player) => {
          return {
            label: `${player.user?.first_name} ${player.user?.last_name}`,
            value: player.id,
          };
        });
        // find index of field key player_ids
        let index = this.fields.findIndex((field) => field.key == 'player_ids');
        // set options for field player_ids
        this.fields[index].props.options = players;
      });
  }

  getClubActive() {
    this._clubService.getAllClubsIsActive().subscribe((data) => {
      let clubs = data.map((club) => {
        return { label: club.name, value: club.id };
      });
      // find index of field key club_ids
      let index = this.fields.findIndex((field) => field.key == 'club_ids');
      // set options for field club_ids
      this.fields[index].props.options = clubs;
    });
  }

  modalOpenForm() {
    this.modalRef = this._modalService.open(this.modalForm, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
    // when close modal reset form
    this.modalRef.closed.subscribe((res) => {
      this.resetForm();
    });

    this.modalRef.dismissed.subscribe((res) => {
      this.resetForm();
    });
  }

  resetForm() {
    this.form.reset();
    this.model = { type: 'email' };
  }

  buildTable() {
    this.dtOptions = {
      dom: this._commonsService.dataTableDefaults.dom,
      select: 'single',
      // serverSide: true,
      rowId: 'id',
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.season_id = this.season_id;
        this._http
          .post<any>(
            `${environment.apiUrl}/send-messages/season`,
            dataTablesParameters
          )
          .subscribe((resp: any) => {
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
            });
          });
      },
      responsive: true,
      scrollX: false,
      language: this._commonsService.dataTableDefaults.lang,
      // columnDefs: [
      //   { targets: 0, responsivePriority: 1 },
      //   { targets: -1, responsivePriority: 2 },
      //   { targets: -2, responsivePriority: 3 },
      // ],
      columns: [
        {
          data: 'title',
          title: this._translateService.instant('Title'),
          render: (data, type, row) => {
            return `<a href="javascript:void(0)" class="text-primary" message-id="${row.id}">${data}</a>`;
          },
        },
        { data: 'content', title: this._translateService.instant('Content') },
        {
          data: 'type',
          title: this._translateService.instant('Type'),
          render: (data, type, row) => {
            return this._translateService.instant(AppConfig.SEND_MESSAGE_TYPES[data]);
          },
        },
        {
          data: 'send_by',
          title: this._translateService.instant('Send by'),
          render: (data, type, row) => {
            if (data == null) return '';
            return `${data.first_name} ${data.last_name} (${data.email})`;
          },
        },
        { data: 'send_to', title: this._translateService.instant('Send to') },
        {
          data: 'created_at',
          title: this._translateService.instant('Created at'),
          render: (data, type, row) => {
            return moment(data).format('YYYY-MM-DD HH:mm:ss');
          },
        },
      ],
      buttons: {
        dom: this._commonsService.dataTableDefaults.buttons.dom,
        buttons: [
          {
            text:
              '<i class="feather icon-plus"></i> ' +
              this._translateService.instant('Add'),
            action: () => {
              this.modalOpenForm();
            },
          },
          {
            text:
              '<i class="feather icon-trash"></i> ' +
              this._translateService.instant('Delete'),
            extend: 'selected',
            action: (e, dt, node, config) => {
              Swal.fire({
                title: this._translateService.instant(
                  'This feature is developing'
                ),
                icon: 'info',
                showCancelButton: false,
                confirmButtonText: this._translateService.instant('OK'),
              });
            },
          },
        ],
      },
    };
  }

  preloadOptions() {
    this.getClubActive();
    this.getGroups(this.season_id);
    this.getPlayerRegisteredInSeason(this.season_id);
    this.buildTable();
  }

  onSeasonChange(event) {
    this.preloadOptions();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  onSubmit() {
    console.log(this.model);
    if (this.form.invalid) {
      return;
    }
    if (
      this.model.hasOwnProperty('group_ids') &&
      Array.isArray(this.model.group_ids)
    ) {
      // array to string
      this.model.group_ids = this.model.group_ids.join(',');
    }

    if (
      this.model.hasOwnProperty('user_ids') &&
      Array.isArray(this.model.user_ids)
    ) {
      // array to string
      this.model.user_ids = this.model.user_ids.join(',');
    }

    if (
      this.model.hasOwnProperty('player_ids') &&
      Array.isArray(this.model.player_ids)
    ) {
      // array to string
      this.model.player_ids = this.model.player_ids.join(',');
    }

    if (
      this.model.hasOwnProperty('club_ids') &&
      Array.isArray(this.model.club_ids)
    ) {
      // array to string
      this.model.club_ids = this.model.club_ids.join(',');
    }
    let data = this.model;
    if (this.model.send_to == 'all_users') {
      data.all_users = true;
    }

    // add user_id
    data.user_id = this._authService.currentUserValue.id;
    data.season_id = this.season_id;
    this._sendMessageService.sendMessage(data).subscribe(
      (res) => {
        this.modalRef.close();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.ajax.reload();
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  ngAfterViewInit(): void {
    this.unlistener = this._render.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('message-id')) {
        let message_id = event.target.getAttribute('message-id');
        console.log(message_id);
        this._router.navigate(['details', message_id], {
          relativeTo: this.route,
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.unlistener();
    this.dtTrigger.unsubscribe();
  }
}
