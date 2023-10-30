import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { ClubService } from 'app/services/club.service';
import { LoadingService } from 'app/services/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-club',
  templateUrl: './manage-club.component.html',
  styleUrls: ['./manage-club.component.scss'],
})
export class ManageClubComponent implements OnInit {
  @Input() club_id: number;
  manager_list: any = [];
  constructor(
    public modalService: NgbModal,
    public _clubService: ClubService,
    public _trans: TranslateService,
    public _loading: LoadingService
  ) {}
  form = new FormGroup({});
  model: any = { email: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'inputButton',
      props: {
        btnClassName: 'btn btn-outline-primary',
        btnText: this._trans.instant('Assign'),
        btnType: 'submit',
        label: this._trans.instant('Email'),
        placeholder:  this._trans.instant('Enter email of manager exist in system'),
        required: true,
      },
    },
  ];

  onSubmit(model) {
    if (this.form.invalid) {
      return;
    }
    this._loading.show();
    console.log(model);
    this._clubService.createClubManager(this.club_id, model.email).subscribe(
      (res) => {
        console.log(res);
        this.getClubManagerByClub();
      },
      (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: this._trans.instant('Error'),
          text: err.message,
        });
      }
    );
  }
  ngOnInit(): void {
    this.getClubManagerByClub();
  }

  getClubManagerByClub() {
    this._loading.show();
    this._clubService.getClubManagerByClub(this.club_id).subscribe((res) => {
      console.log(res);
      this.manager_list = res.data;
    });
  }

  removeManager(id: number) {
    // console.log(id);
    this._loading.show();
    this._clubService.removeClubManager(this.club_id, id).subscribe(
      (res) => {
        console.log(res);
        this.getClubManagerByClub();
      },
      (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: this._trans.instant('Error'),
          text: err.message,
        });
      }
    );
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
