import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/services/user.service';
import { ModalFollowsComponent } from './modal-follows/modal-follows.component';
import { CommonsService } from 'app/services/commons.service';
import { ClubService } from 'app/services/club.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'profile-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  constructor(
    public _userService: UserService,
    public _modalService: NgbModal,
    public _commonsService: CommonsService,
    public _clubService: ClubService,
    public _translateService: TranslateService
  ) {
    this.team_selects = [
      {
        placeholder: 'Select club',
        options: this.club_list,
        key: 'club_id',
        default: this.club_list[0]?.id,
      },
      {
        placeholder: 'Select group',
        options: this.group_list,
        key: 'group_id',
        default: this.group_list[0]?.id,
      },
    ];
  }
  @Input() user: any = {};
  @Input() club_list: any = [];
  @Input() fav_clubs: any = [];
  @Input() team_list: any = [];
  @Input() fav_teams: any = [];
  @Input() group_list: any = [];
  @Output() updateFavClub: EventEmitter<any> = new EventEmitter();
  @Output() updateFavTeam: EventEmitter<any> = new EventEmitter();
  public team_selects = [];
  ngOnInit(): void {}

  ngOnChanges(changes: any) {
    if (
      changes.group_list &&
      changes.group_list.currentValue != changes.group_list.previousValue
    ) {
      this.team_selects[1].options = changes.group_list.currentValue;
      this.team_selects[1].default = changes.group_list.currentValue[0]?.id;
    }

    if (
      changes.club_list &&
      changes.club_list.currentValue != changes.club_list.previousValue
    ) {
      this.team_selects[0].options = changes.club_list.currentValue;
      this.team_selects[0].default = changes.club_list.currentValue[0]?.id;
    }
  }

  lenghtListDemo(list = []) {
    let lengthShow = list.length;
    let lengthHide = 0;
    if (list.length >= 5) {
      lengthShow = 5;
      lengthHide = list.length - 5;
    }
    return {
      lengthShow: lengthShow,
      lengthHide: lengthHide,
    };
  }

  openModalFollows(data, funcToggle: (item) => void, event: EventEmitter<any>) {
    if (data.list.length == 0) {
      Swal.fire({
        icon: 'info',
        title: this._translateService.instant('Notification'),
        text: this._translateService.instant('No data found, please try again later or contact administrator!'),
        confirmButtonText: this._translateService.instant('OK'),
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }
    let modalRef = this._modalService.open(ModalFollowsComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    modalRef.componentInstance.data = data;
    modalRef.componentInstance.onToggle = funcToggle;

    //  when close modal
    modalRef.dismissed.subscribe((res) => {
      event.emit(res);
    });
  }

  toggleFavouriteClub(item: any) {
    this._userService.toggleFavouriteClub(item.id).subscribe(
      (res) => {
        // item.isFollow = !item.isFollow;
      },
      (err) => {
        item.isFollow = false;
        Swal.fire({
          icon: 'error',
          title: this._translateService.instant('Error'),
          text: err.message,
          confirmButtonText: this._translateService.instant('OK'),
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      }
    );
  }

  toggleFavouriteTeam(item: any) {
    this._userService.toggleFavouriteTeam(item.id).subscribe(
      (res) => {
        // item.isFollow = !item.isFollow;
      },
      (err) => {
        item.isFollow = false;
        Swal.fire({
          icon: 'error',
          title: this._translateService.instant('Error'),
          text: err.message,
          confirmButtonText: this._translateService.instant('OK'),
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      }
    );
  }
}
