import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { CommonsService } from 'app/services/commons.service';
import { SendMessagesService } from 'app/services/send-messages.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-messages-details',
  templateUrl: './messages-details.component.html',
  styleUrls: ['./messages-details.component.scss'],
})
export class MessagesDetailsComponent implements OnInit {
  constructor(
    public _commonsService: CommonsService,
    public _translateService: TranslateService,
    public _sendMessageService: SendMessagesService,
    public route: ActivatedRoute,
    public _http: HttpClient
  ) {
    this.message_id = this.route.snapshot.params.id;
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  @ViewChild('modalForm') modalForm: any;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  message_id: any;
  message: any;
  currentTab: any = 'email';
  public contentHeader: object;

  ngOnInit(): void {
    this.getMessage();
  }

  getMessage() {
    this._sendMessageService.getMessageById(this.message_id).subscribe(
      (resp: any) => {
        this.message = resp;
        this.contentHeader = {
          headerTitle: this.message.title,
          actionButton: false,
          breadcrumb: {
            type: '',
            links: [
              {
                name: 'Messages',
                isLink: true,
                link: '/messages',
              },
              {
                name: this.message.title,
                isLink: false,
              },
            ],
          },
        };
        this.buildTable();
        this.dtTrigger.next(this.dtOptions);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  buildTable() {
    this.dtOptions = {
      dom: this._commonsService.dataTableDefaults.dom,
      select: 'single',
      // serverSide: true,
      rowId: 'id',
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.type = this.currentTab;
        this._http
          .post<any>(
            `${environment.apiUrl}/send-messages/${this.message_id}/details`,
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
          data: 'user.first_name',
          title: this._translateService.instant('Receiver'),
          render: (data, type, row) => {
            return `${row.user.first_name} ${row.user.last_name}`;
          },
        },
        { data: 'user.email', title: this._translateService.instant('Email') },
        {
          data: 'status',
          title: this._translateService.instant('Status'),
          className: 'text-center text-uppercase',
          render: (data, type, row) => {
            if (data.email && this.currentTab == 'email') {
              return this._translateService.instant(data.email);
            }

            if (data.push_noti && this.currentTab == 'push_noti') {
              return this._translateService.instant(data.push_noti);
            }
            return '';
          },
        },
        {
          data: 'read',
          title: this._translateService.instant('Read'),
          className: 'text-center',
          visible: this.currentTab == 'email' ? false : true,
          render: (data, type, row) => {
            return data
              ? this._translateService.instant('Yes')
              : this._translateService.instant('No');
          },
        },
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
        buttons: [],
      },
    };
  }

  tabClick(type) {
    this.currentTab = type;
    // filter the table by last column
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //  hide column read if email
      if (type == 'email') {
        dtInstance.column(3).visible(false);
      } else {
        dtInstance.column(3).visible(true);
      }
      // reload the table
      dtInstance.ajax.reload();
    });
  }

  ngAfterViewInit() {}
}
