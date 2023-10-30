import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-error-message",
  templateUrl: "./error-message.component.html",
  styleUrls: ["./error-message.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ErrorMessageComponent implements OnInit {
  @Input() errors: any;
  @Input() field: string;
  @Input() dataTestId: string = "error-message";
  public attr: string;
  constructor(public translate: TranslateService) {}

  errMessage(err: any) {
    const element = document.querySelector(`[field="${this.field}"]`);
    // if have errors and not focus any input   
    
    this.attr = this.translate.instant(this.field);
    // uppercase first letter this.field
    this.attr = this.attr.charAt(0).toUpperCase() + this.attr.slice(1);
    let message = "";
    switch (err.key) {
      case "required":
        message = this.translate.instant("This field is required", {field: this.attr});
        break;
      case "min":
        message =
          this.translate.instant("Value must be greater than") +
          " " +
          (err.value.min - 1);
        break;
      case "max":
        message =
          this.translate.instant("Value must be less than") +
          " " +
          (err.value.max + 1);
        break;
      case "minlength":
        message =
          this.translate.instant("This field must be at least", {field: this.attr}) +
          " " +
          err.value.requiredLength +
          " " +
          this.translate.instant("characters");
        break;
      case "maxlength":
        message =
          this.translate.instant("This field must be less than", {field: this.attr}) +
          " " +
          err.value.requiredLength +
          " " +
          this.translate.instant("characters");
        break;
      case "email":
        message = this.translate.instant("Email is invalid");
        break;
      case "pattern":
        if(err.value.requiredPattern == "/[\\S]/"){
          message = this.translate.instant("Please remove unnecessary whitespaces");
        }else{
        message = this.translate.instant("This field is invalid", {field: this.attr});
        }
        break;
      case "serverError":
        return ;
      default:
        message = this.translate.instant("This field is invalid", {field: this.attr});
        break;
    }
    // console.log("Message: ", message);
    return message;
  }
  ngOnInit(): void {
  }
}
