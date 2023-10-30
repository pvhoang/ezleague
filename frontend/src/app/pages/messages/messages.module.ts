import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageModule } from 'app/layout/components/error-message/error-message.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  EditorSidebarModule,
  serverValidationMessage,
} from 'app/components/editor-sidebar/editor-sidebar.module';
import { BtnDropdownActionModule } from 'app/components/btn-dropdown-action/btn-dropdown-action.module';
import { FormlyConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { MessagesComponent } from './messages.component';
import { FilterPipe } from '@core/pipes/filter.pipe';
import { NgSelectTypeComponent } from 'app/components/ng-select-type/ng-select-type.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { Ckeditor5TypeComponent } from 'app/components/ckeditor5-type/ckeditor5-type.component';
import { FormlyFieldFile } from 'app/components/file-type/file-type.component';
import { MessagesDetailsComponent } from './messages-details/messages-details.component';
import { AllNotificationsComponent } from './all-notifications/all-notifications.component';
import { PermissionsGuard } from 'app/guards/permissions.guard';
import { AppConfig } from 'app/app-config';
const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: AppConfig.PERMISSIONS.send_messages },
  },
  {
    path: 'details/:id',
    component: MessagesDetailsComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: AppConfig.PERMISSIONS.send_messages },
  },
  {
    path: 'all-notifications',
    component: AllNotificationsComponent,
  },
];

@NgModule({
  providers: [FilterPipe],
  declarations: [
    MessagesComponent,
    MessagesDetailsComponent,
    AllNotificationsComponent,
  ],
  imports: [
    CKEditorModule,
    CoreCommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbModule,
    NgbDropdownModule,
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageModule,
    TranslateModule,
    CoreSidebarModule,
    CoreCommonModule,
    DataTablesModule,
    NgSelectModule,
    EditorSidebarModule,
    BtnDropdownActionModule,
    CoreTouchspinModule,
    NgbCollapseModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'ng-select',
          component: NgSelectTypeComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'ckeditor5',
          component: Ckeditor5TypeComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'file',
          component: FormlyFieldFile,
          wrappers: ['form-field'],
        },
      ],
      validationMessages: [
        { name: 'serverError', message: serverValidationMessage },
      ],
    }),
  ],
  exports: [MessagesComponent],
})
export class MessagesModule {
}
