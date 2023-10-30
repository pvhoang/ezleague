import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { StripeScriptTag } from 'stripe-angular';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stripe-checkout',
  templateUrl: './stripe-checkout.component.html',
  styleUrls: ['./stripe-checkout.component.scss'],
})
export class StripeCheckoutComponent implements OnInit {
  amount: number;
  @Input() description: string;
  @Input() products: { name: string; price: number; quantity: number }[];
  @Input() api_checkout: string;
  @Input() closeOnSuccess: boolean = false;
  @Output() onSucceeded: EventEmitter<any> = new EventEmitter();
  cardCaptureReady = false;
  invalidError;
  token;
  cardDetailsFilledOut;
  extraData = {
    type: 'card',
    billing_details: {
      name: '',
    },
  };
  enableSubmit = true;
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'card_name',
      type: 'input',
      props: {
        label: 'Name on card',
        placeholder: 'Name on card',
        required: true,
      },
    },
  ];

  onSubmit(model, stripeCard) {
    console.log(model);
    if (this.form.invalid) {
      return;
    }
    if (this.enableSubmit) {
      this.enableSubmit = false;
      this.extraData.billing_details.name = model.card_name;
      stripeCard.createPaymentMethod(this.extraData);
    }
  }

  constructor(
    private stripeScriptTag: StripeScriptTag,
    public _http: HttpClient,
    public NgbActiveModal: NgbActiveModal,
    public TranslateService: TranslateService
  ) {
    if (!this.stripeScriptTag.StripeInstance) {
      this.stripeScriptTag.setPublishableKey(environment.stripe.publishableKey);
    }
  }

  close() {
    this.NgbActiveModal.close();
  }

  ngOnInit(): void {
    this.amount = this.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }
  onStripeInvalid(error: Error) {
    console.log('Validation Error', error);
  }

  onStripeError(error: Error) {
    console.error('Stripe error', error);
  }

  setPaymentMethod(token: stripe.paymentMethod.PaymentMethod) {
    if (this.api_checkout) {
      this._http
        .post(this.api_checkout, {
          payment_method: token.id,
          amount: this.amount,
          description: this.description,
        })
        .subscribe(
          (res) => {
            console.log(res);
            this.onSucceeded.emit(res);
            if (this.closeOnSuccess) {
              this.close();
            }
          },
          (err) => {
            if (err.message) {
              this.enableSubmit = true;
              this.invalidError = {
                message: err.message,
              };
            }
            // Swal.fire({
            //   icon: 'error',
            //   title: this.TranslateService.instant('Payment Failed'),
            //   text: err.message,
            // });
            console.log(err);
          }
        );
    }
    console.log('Stripe Payment Method', token);
  }

  setStripeToken(token: stripe.Token) {
    this.token = token;
    console.log('Stripe Token', token);
  }

  setStripeSource(source: stripe.Source) {
    console.log('Stripe Source', source);
  }

  completeChange() {
    console.log('Card Information', this.cardDetailsFilledOut);
  }
}
