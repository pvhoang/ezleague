import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BtnDropdownActionComponent } from "./btn-dropdown-action.component";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CoreCommonModule } from "@core/common.module";

@NgModule({
  declarations: [BtnDropdownActionComponent],
  imports: [CommonModule, FormsModule, TranslateModule, NgbDropdownModule,CoreCommonModule],
  exports: [BtnDropdownActionComponent],
})
export class BtnDropdownActionModule {}
