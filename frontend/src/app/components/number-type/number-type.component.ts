import { Component, OnInit } from '@angular/core';
import { FieldTypeConfig,FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-number-type',
  templateUrl: './number-type.component.html',
  styleUrls: ['./number-type.component.scss'],
})
export class NumberTypeComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  constructor() {
    super();
  }
  ngOnInit(): void {
    // console.log(this.to);
  }
  onChange(event) {
    // console.log(event);
    this.formControl.setValue(event);
  }
}
