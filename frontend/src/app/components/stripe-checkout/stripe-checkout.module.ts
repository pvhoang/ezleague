import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeCheckoutComponent } from './stripe-checkout.component';
import { StripeModule } from 'stripe-angular';
import { environment } from 'environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { EditorSidebarModule } from '../editor-sidebar/editor-sidebar.module';

@NgModule({
  declarations: [StripeCheckoutComponent],
  imports: [
    CommonModule,
    StripeModule.forRoot(
      'pk_test_51NQ3UmDXDLBGPpQrT99fYhZ3lmv2GrN667trK2Kuyp8Of9z4wqr7n73UWqmIAwlp3pvV0B6wg6Clv3JYmle4bsqV00a7Nb4Lba'
    ),
    TranslateModule,
    FormsModule,
    NgbAlertModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    EditorSidebarModule,
  ],
  exports: [StripeCheckoutComponent],
})
export class StripeCheckoutModule {}
