import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-btn-dropdown-action',
  templateUrl: './btn-dropdown-action.component.html',
  styleUrls: ['./btn-dropdown-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnDropdownActionComponent implements OnInit {
  @Input()
  btnStyle: string;
  @Input()
  class: string; 
  @Input()
  data = {};
  @Input()
  actions: EZBtnActions[] = [];
  @Output()
  emitter = new Subject<any>();
  constructor() {}
  ngOnInit() {}
  onClick(action: any) {
    // console.log(action);
    // console.log(this.data);
    this.emitter.next({
      action,
      data: this.data,
    });
  }
  ngOnDestroy() {
    this.emitter.unsubscribe();
  }
}
export interface EZActionButton {
  label?: string;
  onClick?: Function;
  icon?: string;
}
export interface EZBtnActions {
  type?: string;
  label?: string;
  onClick?: Function;
  icon?: string;
  buttons?: EZActionButton[];
}
