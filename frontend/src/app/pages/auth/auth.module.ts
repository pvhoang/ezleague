import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';
import { AuthForgotPasswordComponent } from './auth-forgot-password/auth-forgot-password.component';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { TranslateModuleModule } from 'app/components/translate-module/translate-module.module';
import { ErrorMessageModule } from 'app/layout/components/error-message/error-message.module';

const routes: Routes = [
    {
        path: 'auth/login',
        component: AuthLoginComponent
    },
    {
        path: 'auth/reset-password/:token/:email',
        component: AuthResetPasswordComponent
    },
    {
        path: 'auth/forgot-password',
        component: AuthForgotPasswordComponent
    },
    {
        path: 'auth/register', 
        component: AuthRegisterComponent
    }
];

@NgModule({
  declarations: [
    AuthLoginComponent,
    AuthForgotPasswordComponent,
    AuthResetPasswordComponent,
    AuthRegisterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    TranslateModule,
    TranslateModuleModule,
    ErrorMessageModule
  ],
})
export class AuthenticationModule {}