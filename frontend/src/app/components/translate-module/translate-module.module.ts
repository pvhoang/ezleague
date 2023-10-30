import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModuleComponent } from './translate-module.component';



@NgModule({
  declarations: [TranslateModuleComponent],
  imports: [
    CommonModule
  ],
  exports: [TranslateModuleComponent]
})
export class TranslateModuleModule { }
