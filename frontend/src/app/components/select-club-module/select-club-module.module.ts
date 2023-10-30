import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectClubModuleComponent } from './select-club-module.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [SelectClubModuleComponent],
  imports: [
    CommonModule,
    FormsModule      ,
    TranslateModule
  ],
  exports: [SelectClubModuleComponent]
})
export class SelectClubModuleModule { }
