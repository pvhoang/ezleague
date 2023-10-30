import { Component, OnInit } from "@angular/core";
import { FormGroupDirective } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FieldType } from "@ngx-formly/bootstrap/form-field";
import { FieldTypeConfig } from "@ngx-formly/core";
import moment from "moment";
@Component({
  selector: "app-datatimepicker",
  templateUrl: "./datatimepicker.component.html",
  styleUrls: ["./datatimepicker.component.scss"],
})
export class DatatimepickerComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  public dtPicker: NgbDateStruct; 
  public submitted = false;
  constructor(private ngForm: FormGroupDirective) {
    super();
    ngForm.ngSubmit.subscribe(event => {
      this.submitted = true;
    });
  }
 
  ngOnInit(): void {
    // subscribe to value of formControl to update datetime
    this.formControl.valueChanges.subscribe((value) => {
      let date = new Date(value);
      this.dtPicker = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
    });
  }
  onDateSelect(event: any) {
    console.log("onDateSelect: ", event);
    // format date to yyyy-mm-dd using moment
    let date = new Date(event.year, event.month - 1, event.day);
    this.formControl.setValue(moment(date).format("YYYY-MM-DD"));
  }
  onChanges(event) {  
    console.log("dtPicker: ", this.dtPicker);    
    if(this.dtPicker && this.dtPicker.hasOwnProperty('day')) {
      let date = new Date(this.dtPicker.year, this.dtPicker.month - 1, this.dtPicker.day);
      this.formControl.setValue(moment(date).format("YYYY-MM-DD"));
    }
  }
  onBlur($event) {
    this.formControl.markAsTouched();
  }
}
