import { SelectClubModuleModule } from './../../components/select-club-module/select-club-module.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorMessageModule } from './../../layout/components/error-message/error-message.module';
import { ContentHeaderModule } from './../../layout/components/content-header/content-header.module';
import { Routes, RouterModule } from '@angular/router';
import { SelectEventComponent } from './select-event/select-event.component';
import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPlayerComponent } from './select-player/select-player.component';
import { RegisterNewPlayerComponent } from './register-new-player/register-new-player.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreSidebarModule } from '@core/components';
import { SelectPlayerGuard } from 'app/guards/select-player.guard';
import { CoreCommonModule } from '@core/common.module';
import { PermissionsGuard } from 'app/guards/permissions.guard';
import { AppConfig } from 'app/app-config';
import { CropperWithDialogModule } from 'app/components/cropper-dialog/cropper-with-dialog.module';
import { LyCommonModule, LyTheme2, StyleRenderer } from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { ModalSuitableGroupComponent } from './register-new-player/modal-suitable-group/modal-suitable-group.component';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlyFieldFile } from 'app/components/file-type/file-type.component';
import { NumberTypeComponent } from 'app/components/number-type/number-type.component';
import { ImageCropperTypeComponent } from 'app/components/image-cropper-type/image-cropper-type.component';
import { NgSelectTypeComponent } from 'app/components/ng-select-type/ng-select-type.component';
import {
  EditorSidebarModule,
  serverValidationMessage,
} from 'app/components/editor-sidebar/editor-sidebar.module';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { registerTranslateExtension } from 'app/translate.extension';
import { StripeCheckoutModule } from 'app/components/stripe-checkout/stripe-checkout.module';
import { StripeModule } from 'stripe-angular';
import { environment } from 'environments/environment';

@Injectable()
export class CustomMinimaLight {
  name = 'minima-light';
  demoBg = new Color(0x8c8c8c);
}

const routes: Routes = [
  { path: '', redirectTo: 'select-event', pathMatch: 'full' },
  {
    path: 'select-event',
    component: SelectEventComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: AppConfig.PERMISSIONS.registration },
  },
  {
    path: 'season/:seasonId/select-player',
    component: SelectPlayerComponent,
    canActivate: [SelectPlayerGuard],
  },
  {
    path: 'season/:seasonId/register-new-player',
    component: RegisterNewPlayerComponent,
  },
  {
    path: 'modal-suitable-group',
    component: ModalSuitableGroupComponent,
  },
];

@NgModule({
  declarations: [
    SelectEventComponent,
    SelectPlayerComponent,
    RegisterNewPlayerComponent,
    ModalSuitableGroupComponent,
  ],
  imports: [
    StripeModule.forRoot(environment.stripe.publishableKey),
    EditorSidebarModule,
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageModule,
    TranslateModule,
    SelectClubModuleModule,
    CoreSidebarModule,
    CoreCommonModule,
    CropperWithDialogModule,
    LyCommonModule,
    FormlyModule.forRoot({
      types: [
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
    SelectEventComponent,
    SelectPlayerComponent,
    RegisterNewPlayerComponent,
  ],
})
export class RegistrationModule {}
