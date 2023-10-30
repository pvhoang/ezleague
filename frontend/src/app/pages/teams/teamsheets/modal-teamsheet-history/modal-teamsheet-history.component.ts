import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonsService } from 'app/services/commons.service';
import { LoadingService } from 'app/services/loading.service';
import { TeamService } from 'app/services/team.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-teamsheet-history',
  templateUrl: './modal-teamsheet-history.component.html',
  styleUrls: ['./modal-teamsheet-history.component.scss'],
})
export class ModalTeamsheetHistoryComponent implements OnInit {
  dtOptions1: any = {};
  dtTrigger: any = {};
  public teamId: any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;

  constructor(
    public modalService: NgbModal,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public _http: HttpClient,
    public renderer: Renderer2,
    public _teamService: TeamService,
    public loadingService: LoadingService,
    public _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let seasonId = this._route.snapshot.paramMap.get('seasonId');
    console.log('team id', this.teamId);
    let current_season_player_url = `${environment.apiUrl}/team-sheets/team/${this.teamId}`;

    this.dtOptions1 = this.buildDtOptions1(
      current_season_player_url,
      this.teamId
    );
  }

  buildDtOptions1(url, params: any) {
    return {
      dom: this._commonsService.dataTableDefaults.dom,
      ajax: (dataTablesParameters: any, callback) => {
        this._http
          .post<any>(`${url}`, dataTablesParameters)
          .subscribe((resp: any) => {
            callback({
              // this function callback is used to return data to datatable
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
            });
          });
      },

      select: 'single',
      // serverSide: true,
      rowId: 'id',
      // fake data
      responsive: true,

      scrollX: false,
      language: this._commonsService.dataTableDefaults.lang,

      columnDefs: [
        { responsivePriority: 1, targets: -1 },
        { responsivePriority: 2, targets: 0 },
        { responsivePriority: 3, targets: 1 },
      ],
      columns: [
        {
          // name
          data: 'created_at',
          render: function (data, type, row) {
            // return button open and download
            let date = new Date(data);
            let date_format = date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            });
            return date_format;
          },
        },
        {
          // name
          data: 'document',
          render: (data, type, row) => {
            // return button open and download
            let url = data;
            let textviewfile = this._translateService.instant('View file');
            let btn_open = `<a href="${url}" target="_blank" class="btn btn-sm bg-transparent btn-outline-primary " title="Open"><i class="fas fa-eye"></i> ${textviewfile} </a>`;

            return btn_open;
          },
        },
      ],
      buttons: [],
    };
  }

  private unlistener: () => void;

  ngAfterViewInit(): void {
    this.unlistener = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('data-row-value')) {
        let row = event.target.getAttribute('data-row-value');
        row = JSON.parse(row);

        this.editor(event.target.getAttribute('action'), row);
      }
    });
  }

  editor(action, row) {}

  onClose() {
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.unlistener();
  }
}
