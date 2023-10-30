import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorSidebarComponent } from './editor-sidebar.component';
import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';
import {
  FORMLY_CONFIG,
  FormlyConfig,
  FormlyFieldConfig,
  FormlyModule,
} from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { DatatimepickerComponent } from 'app/layout/components/datatimepicker/datatimepicker.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import {
  NgbAlertModule,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldFile } from '../file-type/file-type.component';
import { FileValueAccessor } from '../file-type/file-value-accessor';
import { NumberTypeComponent } from '../number-type/number-type.component';
import { ImageCropperTypeComponent } from '../image-cropper-type/image-cropper-type.component';
import { CropperWithDialogModule } from '../cropper-dialog/cropper-with-dialog.module';
import { NgSelectTypeComponent } from '../ng-select-type/ng-select-type.component';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { registerTranslateExtension } from 'app/translate.extension';
export function serverValidationMessage(error: any, field: FormlyFieldConfig) {
  // console.log(error, field);
  return error;
}
@NgModule({
  declarations: [
    EditorSidebarComponent,
    DatatimepickerComponent,
    FormlyFieldFile,
    FileValueAccessor,
    ImageCropperTypeComponent,
    NgSelectTypeComponent,
  ],
  imports: [
    FormlySelectModule,
    NgSelectModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    CoreSidebarModule,
    ReactiveFormsModule,
    CropperWithDialogModule,
    NgbAlertModule,
    FormlyModule.forRoot({
      types: [
        { name: 'datetime', component: DatatimepickerComponent },
        { name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] },
        {
          name: 'core-touchspin',
          component: NumberTypeComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'image-cropper',
          component: ImageCropperTypeComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'ng-select',
          component: NgSelectTypeComponent,
          wrappers: ['form-field'],
        },
      ],
      validationMessages: [
        { name: 'serverError', message: serverValidationMessage },
      ],
    }),
    FormlyBootstrapModule,
    NgbDatepickerModule,
  ],
  providers: [
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslateExtension,
      deps: [TranslateService],
    },
  ],
  exports: [
    EditorSidebarComponent,
    FormlyModule,
    FormlyBootstrapModule,
    ReactiveFormsModule,
    CropperWithDialogModule,
    NgbAlertModule,
  ],
})
export class EditorSidebarModule {
  constructor(_translateService: TranslateService, config: FormlyConfig) {
    config.addValidatorMessage('max', (error, field) => {
      return (
        _translateService.instant('Value must be less than') +
        ' ' +
        (field.props.max + 1)
      );
    });
    config.addValidatorMessage('min', (error, field) => {
      return (
        _translateService.instant('Value must be greater than') +
        ' ' +
        (field.props.min - 1)
      );
    });
    config.addValidatorMessage('minlength', (error, field) => {
      let fieldName = _translateService.instant(field.key as string);
      fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      return (
        _translateService.instant('This field must be at least', {
          field: fieldName,
        }) +
        ' ' +
        field.props.minLength +
        ' ' +
        _translateService.instant('characters')
      );
    });
    config.addValidatorMessage('maxlength', (error, field) => {
      let fieldName = _translateService.instant(field.key as string);
      fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      return (
        _translateService.instant('This field must be less than', {
          field: fieldName,
        }) +
        ' ' +
        field.props.maxLength +
        ' ' +
        _translateService.instant('characters')
      );
    });
    config.addValidatorMessage('pattern', (error, field) => {
      let fieldName = _translateService.instant(field.key as string);
      fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      return _translateService.instant('This field is invalid', {
        field: fieldName,
      });
    });
    config.addValidatorMessage('required', (error, field) => {
      let fieldName = _translateService.instant(field.key as string);
      fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      // replace '_' with ' '
      fieldName = fieldName.replace(/_/g, ' ');
      return _translateService.instant('This field is required', {
        field: fieldName,
      });
    });
  }
}
