import { Component, OnInit } from '@angular/core';
import { FieldTypeConfig, FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-ng-select-type',
  templateUrl: './ng-select-type.component.html',
  styleUrls: ['./ng-select-type.component.scss'],
})
export class NgSelectTypeComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  constructor() {
    super();
  }
  ngOnInit(): void {
    // console.log(this.field);
    if (!this.to.hasOwnProperty('searchable')) {
      this.to.searchable = true;
    }
  }
  onChange(event) {
    // console.log(event);
    this.formControl.setValue(event);
  }
}
