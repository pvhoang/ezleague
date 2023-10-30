import { CommonsService } from '../../../services/commons.service';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { EditorSidebarParams } from 'app/interfaces/editor-sidebar';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { TEAM_BOYS, TEAM_GIRLS, TEAM_MIXED } from './groups-contants';
import { RegistrationService } from 'app/services/registration.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;

  // public variables
  public contentHeader: object;
  dtOptions: any = {};
  seasonId: Number;
  table_name = 'groups-table';

  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: this._translateService.instant('Create new Group'),
      edit: this._translateService.instant('Edit group'),
      remove: this._translateService.instant('Delete event'),
    },
    url: `${environment.apiUrl}/groups/editor`,
    method: 'POST',
    action: 'create',
  };

  public fields: FormlyFieldConfig[] = [
    {
      key: 'season_id',
      type: 'input',
      props: {
        type: 'hidden',
        label: '',
        placeholder: 'Enter season id of group',
        required: true,
      },
      className: '',
    },
    {
      key: 'name',
      type: 'input',
      props: {
        label: this._translateService.instant('Group name'),
        placeholder: this._translateService.instant('Enter name of group'),
        //only text and number and space allowed
        pattern: '^[a-zA-Z0-9 ]*$',
        maxLength: 30,
        required: true,
      },
      parsers: [
        (value) => {
          if (value) {
            return value.replace(/[^a-zA-Z0-9 ]/g, '');
          }
          // trim and remove all special characters
        },
      ],
      className: '',
    },
    {
      key: 'years',
      type: 'input',
      props: {
        label: this._translateService.instant('Group years'),
        placeholder: this._translateService.instant('Enter years of group'),
        required: true,
        maxLength: 9,
        // only number and - not space allowed and if (- at the beginning or end or more than one (-) in the middle) then not valid
        pattern: '^[0-9]{4}(-[0-9]{4})?$',
      },
      // reformat the input value
      parsers: [
        (value) => {
          if (value) {
            return value.replace(/[^0-9-]/g, '').length > 4
              ? value
                  .replace(/[^0-9-]/g, '')
                  .replace(/(\d{4})(\d{1,})/, '$1-$2')
              : value.replace(/[^0-9-]/g, '');
          }
          // trim and remove all special characters then add - between years if length is over 4
        },
      ],
      validation: {
        messages: {
          pattern: (error, field: FormlyFieldConfig) => {
            return `"${
              field.formControl.value
            }" ${this._translateService.instant(
              'is not valid or contains space between years'
            )}`;
          },
        },
      },
      className: '',
    },
    {
      key: 'type',
      type: 'select',
      props: {
        label: this._translateService.instant('Group type'),
        placeholder: this._translateService.instant('Enter type of group'),
        required: true,
        options: [
          {
            label: this._translateService.instant('Boys'),
            value: TEAM_BOYS,
            checked: true,
          },
          {
            label: this._translateService.instant('Girls'),
            value: TEAM_GIRLS,
            checked: false,
          },
          {
            label: this._translateService.instant('Mixed'),
            value: TEAM_MIXED,
            checked: false,
          },
        ],

        className: '',
      },
    },
  ];

  constructor(
    private _http: HttpClient,
    private _route: ActivatedRoute,
    public _coreSidebarService: CoreSidebarService,
    public _translateService: TranslateService,
    public registrationService: RegistrationService,
    public _commonsService: CommonsService
  ) {
    this.seasonId = this._route.snapshot.params.seasonId;
    console.log(this._route.snapshot.params);
    this.fields[0].defaultValue = this.seasonId;
  }

  getSeasonName() {
    let season_id = parseInt(this._route.snapshot.params.seasonId);
    // parse int season id
    this.registrationService.getSeasonByID(season_id).subscribe((resp: any) => {
      console.log(resp);
      this.contentHeader = {
        headerTitle: 'Groups',
        actionButton: false,
        breadcrumb: {
          type: '',
          links: [
            {
              name: 'Home',
              isLink: true,
              link: '/home',
            },
            {
              name: 'Tables',
              isLink: false,
            },
            {
              name: resp.name,
              isLink: true,
              link: '/tables/events',
            },
            {
              name: 'Groups',
              isLink: false,
            },
          ],
        },
      };
    });
  }

  ngOnInit(): void {
    this.getSeasonName();

    this.dtOptions = {
      dom: this._commonsService.dataTableDefaults.dom,
      // serverSide: true,
      select: {
        style: 'single',
      },
      rowId: 'id',
      ajax: (dataTablesParameters: any, callback) => {
        // merge the datatable parameters with the season id
        dataTablesParameters.season_id = this.seasonId;
        console.log(dataTablesParameters);

        this._http
          .post<any>(`${environment.apiUrl}/groups/all`, dataTablesParameters)
          .subscribe((resp: any) => {
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
            });
          });
      },
      language: this._commonsService.dataTableDefaults.lang,
      columns: [
        {
          data: 'name',
          className: 'font-weight-bolder',
        },
        {
          data: 'years',
          className: 'center',
        },
        {
          data: 'type',
          className: 'center',
        },
      ],
      buttons: {
        dom: this._commonsService.dataTableDefaults.buttons.dom,
        buttons: [
          {
            text:
              '<i class="feather icon-plus"></i> ' +
              this._translateService.instant('Add'),
            action: () => this.editor('create'),
          },
          {
            text:
              '<i class="feather icon-edit"></i> ' +
              this._translateService.instant('Edit'),
            action: () => this.editor('edit'),
            extend: 'selected',
          },
          {
            text:
              '<i class="feather icon-trash"></i> ' +
              this._translateService.instant('Delete'),
            action: () => this.editor('remove'),
            extend: 'selected',
          },
        ],
      },
    };
  }

  editor(action) {
    this.params.action = action;
    this._coreSidebarService.getSidebarRegistry(this.table_name).toggleOpen();
  }
}
