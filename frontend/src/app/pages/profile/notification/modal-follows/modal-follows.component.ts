import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommonsService } from 'app/services/commons.service';
import { UserService } from 'app/services/user.service';
import { FilterPipe } from '@core/pipes/filter.pipe';

export interface SelectInModal {
  placeholder: string;
  options: { id: string; name: string }[];
  filter: string;
  key: string;
  default?: string;
}
@Component({
  selector: 'app-modal-follows',
  templateUrl: './modal-follows.component.html',
  styleUrls: ['./modal-follows.component.scss'],
})
export class ModalFollowsComponent implements OnInit {
  search: string = '';
  filteredItems: any[] = [];
  @Input() data: {
    title: string;
    list: any[];
    selects: SelectInModal[];
  };
  @Input() onToggle: (item) => void;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public _modalService: NgbActiveModal,
    public _commonsService: CommonsService,
    public _userService: UserService,
    public _translateService: TranslateService,
    public _filter: FilterPipe
  ) {}

  ngOnInit(): void {
    // deep clone list original to filter
    this.filteredItems = JSON.parse(JSON.stringify(this.data.list));
    if (this.data.selects && this.data.selects.length > 0) {
      this.filterList(true);
    }
  }
  
  close() {
    this._modalService.dismiss();
  }

  changeFollow(item) {
    // console.log(this.onToggle);
    this.onToggle(item);
    item.isFollow = !item.isFollow;
    this.data.list.forEach((element) => {
      if (element.id == item.id) {
        element.isFollow = item.isFollow;
      }
    });
  }

  onSelected(item, select) {
    // console.log(item, select);
    // console.log(select.filter);
    // clone filteredItems
    this.filterList();
  }

  filterList(defaultFilter = false) {
    this.filteredItems = JSON.parse(JSON.stringify(this.data.list));
    this.data.selects.forEach((select) => {
      if (defaultFilter) {
        select.filter = select.default;
      }
      this.filteredItems = this._filter.transform(
        this.filteredItems,
        select.filter,
        select.key,
        true
      );
    });
  }

  // this.data.selects.forEach((select) => {
  //   this.data.list = this._filter.transform(
  //     this.data.list,
  //     select.filter,
  //     select.key
  //   );
  // });
}
