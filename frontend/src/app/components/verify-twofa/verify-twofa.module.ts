import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyTwofaComponent } from './verify-twofa.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VerifyTwofaComponent],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [VerifyTwofaComponent],
})
export class VerifyTwofaModule {}
