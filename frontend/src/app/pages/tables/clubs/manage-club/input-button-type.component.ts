import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-button',
  template: `
    <div class="input-group">
      <input
        type="props.type"
        [formControl]="formControl"
        [formlyAttributes]="field"
        class="form-control"
        [ngClass]="props.className"
      />
      <div class="input-group-append">
        <button
          [type]="props.btnType"
          [ngClass]="props.btnClassName"
          (click)="onClick($event)"
        >
          {{ props.btnText }}
        </button>
      </div>
    </div>
  `,
})
export class FormlyFieldButton extends FieldType {
  onClick($event: Event) {
    if (this.props.onClick) {
      this.props.onClick($event);
    }
  }
}
