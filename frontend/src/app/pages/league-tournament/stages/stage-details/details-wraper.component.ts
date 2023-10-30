import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-details',
  template: `
    <style></style>
    <div class="form-group">
      <ng-container #fieldComponent></ng-container>
      <ng-container *ngFor="let item of field.props.options">
        <p class="ml-1" *ngIf="item.value === field.formControl.value && item.description" [innerHTML]="item.description">
        </p>
      </ng-container>
    </div>
  `,
})
export class DetailsWrapperComponent extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef })
  fieldComponent: ViewContainerRef;
}
