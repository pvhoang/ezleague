import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';

import {
  EditorSidebarModule,
  serverValidationMessage,
} from 'app/components/editor-sidebar/editor-sidebar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRegistrationComponent } from './admin-registration.component';
import { ValidatorComponent } from './validator/validator.component';
import { FormlyConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { CustomWrapperComponent } from './validator/custom-wraper.component';

// routing
const routes: Routes = [
  {
    path: '',
    component: AdminRegistrationComponent,
  },
];

@NgModule({
  declarations: [
    AdminRegistrationComponent,
    ValidatorComponent,
    CustomWrapperComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreSidebarModule,
    CoreCommonModule,
    DataTablesModule,
    ContentHeaderModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EditorSidebarModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      wrappers: [{ name: 'validate', component: CustomWrapperComponent }],
      validationMessages: [
        { name: 'serverError', message: serverValidationMessage },
        { name: 'required', message: 'This field is required' },
      ],
    }),
    FormlyBootstrapModule,
  ],
  exports: [AdminRegistrationComponent, ValidatorComponent],
})
export class AdminRegistrationModule {}
