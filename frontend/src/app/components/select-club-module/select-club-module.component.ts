import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationService } from './../../services/registration.service';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import Swal from 'sweetalert2';
import { EventEmitter } from '@angular/core';
import { ModalSuitableGroupComponent } from 'app/pages/registration/register-new-player/modal-suitable-group/modal-suitable-group.component';
import { SeasonService } from 'app/services/season.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-club-module',
  templateUrl: './select-club-module.component.html',
  styleUrls: ['./select-club-module.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectClubModuleComponent implements OnInit {
  // get playerId from parent component
  @Input() playerId: string;
  @Input() nearestClub: string;
  @Input() eventUpdatePlayer: EventEmitter<any> = new EventEmitter();
  //public variable
  public clubs = [];
  public selectedClub: string;
  public selectedClubId: number;
  // child component #modalSelectClub
  @ViewChild("modalSelectClub") modalSelectClub: ElementRef;
  constructor(
    private modalService: NgbModal,
    private _registrationService: RegistrationService,
    public _seasonService: SeasonService,
    public _translateService: TranslateService,
    public renderer: Renderer2
  ) {}

  ngOnInit(): void {}

  modalOpenForm(modalForm) {
    this.clubs = this._registrationService.allClubs;

    // get nearest club
    this.selectedClubId = Number(this.nearestClub);
    this.selectedClub = this.clubs.find(
      (club) => club.id === this.selectedClubId
    )?.name;

    if(!this.selectedClub){
      this.selectedClubId = 0;
      this.ChangeClubModal();
      return;
    }
    
    this.modalService
      .open(modalForm, {
        centered: true,
        windowClass: 'animation-disable',
        animation: false,
      })
      .result.then(
        (result) => {
          this.ChangeClubModal();
        },
        (reason) => {
          console.warn(reason);
          if (reason == 'Accept click') {
            if (this.selectedClubId == 0) {
              Swal.fire({
                title: 'Please select a club',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#7367f0',
              });
            } else {
              this.registerOldPlayer();
            }
          }
        }
      );
  }

  ChangeClubModal() {
    this.modalService
      .open(this.modalSelectClub, {
        centered: true,
        windowClass: 'animation-disable',
        animation: false,
        backdrop: 'static',
      })
      .result.then(
        (result) => {
          this.registerOldPlayer();
        },
        (reason) => {
          // Swal.fire({
          //   title: "Please select a club",
          //   icon: "warning",
          //   confirmButtonText: "Ok",
          //   confirmButtonColor: "#7367f0",
          // });
        }
      );
  }

  // call registration service to change club
  registerOldPlayer() {
    this._registrationService
      .registerOldPlayer(
        this._registrationService.selectedSeason['id'],
        this.selectedClubId,
        this.playerId
      )
      .subscribe(
        (data) => {
          if (typeof data.registration !== 'undefined') {
            Swal.fire({
              title: 'Notification',
              text: data.message,
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#7367f0',
            }).then((result) => {
              if (result.isConfirmed) {
                this.eventUpdatePlayer.emit();
              }
            });
          }
        },
        (error) => {
          let message_detail = '';
          if (error.hasOwnProperty('error') && error.error == 'NOT_SUITABLE') {
            message_detail = `<a suitableGroup= "suitableGroup" href="javascript:void(0)" class="text-primary"> 
            ${this._translateService.instant('Details')} 
            </a>`;
          }
          Swal.fire({
            title: this._translateService.instant('Error'),
            html: ` <div class="text-center">
                <img src="assets/images/Frame.png" alt="Frame" width="200px" height="149px">
                <p class="text-center">${error.message}.
                ${message_detail}
                </p>
              </div>`,
            // icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#7367f0',
          });
        }
      );
  }

  // modal Suitatble group
  openSuitableGroupModal() {
    const modalRef = this.modalService.open(ModalSuitableGroupComponent, {
      size: 'sm',
      centered: true,
      backdrop: 'static',
    });

    this._seasonService
      .getGroupsBySeason(this._registrationService.selectedSeason['id'])
      .subscribe((data) => {
        modalRef.componentInstance.groups = data;
      });
  }
}
