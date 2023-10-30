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
import { MatchCardModule } from 'app/components/match-card/match-card.module';
import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileSercurityComponent } from './profile-sercurity/profile-sercurity.component';
import { NotificationComponent } from './notification/notification.component';
import { ModalFollowsComponent } from './notification/modal-follows/modal-follows.component';
import { ModalTwofaComponent } from './profile-sercurity/modal-twofa/modal-twofa.component';
import { FilterPipe } from '@core/pipes/filter.pipe';
import { QRCodeModule } from 'angularx-qrcode';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Profile' },
  },
];

@NgModule({
  providers: [FilterPipe],
  declarations: [
    ProfileComponent,
    EditProfileComponent,
    ProfileSercurityComponent,
    NotificationComponent,
    ModalFollowsComponent,
    ModalTwofaComponent,
  ],
  imports: [
    QRCodeModule,
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
    MatchCardModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'serverError', message: serverValidationMessage },
      ],
    }),
  ],
  exports: [
    ProfileComponent,
    EditProfileComponent,
    ProfileSercurityComponent,
    NotificationComponent,
    ModalTwofaComponent,
  ],
})
export class ProfileModule {}
