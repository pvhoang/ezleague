import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-panel',
  template: `
    <style>
      .status-card-left::before {
        background-color: #a8aaae;
        width: 5px;
        height: 100%;
        content: 'a';
        font-size: 0;
        position: absolute;
        top: 0;
        left: 0;
        border-top-left-radius: inherit;
        border-bottom-left-radius: inherit;
      }
      .status-card-left-success::before {
        background-color: #28c76f;
      }
      .status-card-left-warning::before {
        background-color: #ffc107;
      }
      .status-card-left-danger::before {
        background-color: #ff0000;
      }
      .form-group {
        margin-bottom: 8px;
      }
    </style>
    <div class="card pl-1 pr-1 pb-0 mb-1 status-card-left" [ngClass]="field.props.accepted?'status-card-left-success':'status-card-left-danger'">
      <label>{{ to.label | translate }}</label>
      <div class="row">
        <div class="col-12 col-lg-6">
          <div class="form-group">
            <ng-container #fieldComponent></ng-container>
          </div>
        </div>
        <div class="col-12 col-lg-6 pr-1 d-flex align-items-center ">
          <div class="row align-items-center">
            <div class="col-12 form-check col-lg-auto d-flex ml-2 ml-lg-0 mb-1">
              <input
                class="form-check-input"
                type="radio"
                [name]="field.key"
                id="accept_{{ field.key }}"
                [value]="true"
                [(ngModel)]="field.props.accepted"
                [ngModelOptions]="{ standalone: true }"
                [checked]="
                  field.props.hasOwnProperty('accepted') && field.props.accepted
                    ? true
                    : false
                "
              />
              <label for="accept_{{ field.key }}">{{
                'Accept' | translate
              }}</label>
            </div>
            <div class="col-auto form-check ml-2 ml-lg-0 mb-1">
              <input
                class="form-check-input"
                type="radio"
                [name]="field.key"
                id="reject_{{ field.key }}"
                [value]="false"
                [(ngModel)]="field.props.accepted"
                [ngModelOptions]="{ standalone: true }"
                [checked]="
                  field.props.hasOwnProperty('accepted') &&
                  !field.props.accepted
                    ? true
                    : false
                "
              />
              <label for="reject_{{ field.key }}">{{
                'Reject' | translate
              }}</label>
            </div>
            <div class="col form-group">
              <input
                class="form-control"
                type="text"
                id="reason_{{ field.key }}"
                *ngIf="
                  field.props.hasOwnProperty('accepted') &&
                  !field.props.accepted
                "
                placeholder="{{ 'Enter reason' | translate }}"
                [(ngModel)]="field.props.message"
                [ngModelOptions]="{ standalone: true }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="invalid-feedback d-block">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
    </div>
  `,
})
export class CustomWrapperComponent extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef })
  fieldComponent: ViewContainerRef;
}
