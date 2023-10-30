import { ContentHeaderModule } from './layout/components/content-header/content-header.module';
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import 'hammerjs';
import {
  NgbCollapseModule,
  NgbModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { HomeComponent } from './pages/home/home.component';
import { AuthenticationModule } from './pages/auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
import { ErrorInterceptor, JwtInterceptor } from './helpers';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';
import { ErrorMessageModule } from './layout/components/error-message/error-message.module';
import {
  StyleRenderer,
  LyTheme2,
  LyCommonModule,
  LY_THEME_NAME,
  LY_THEME,
} from '@alyle/ui';
import { CropperWithDialogModule } from './components/cropper-dialog/cropper-with-dialog.module';
import { Color } from '@alyle/ui/color';
import {
  MinimaLight,
  MinimaDeepDark,
  MinimaDark,
} from '@alyle/ui/themes/minima';
import { ContentBackgroundModule } from './layout/components/content-background/content-background.module';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { FcmService } from './services/fcm.service';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireModule } from '@angular/fire/compat';
import { ProfileModule } from './pages/profile/profile.module';
import { VerifyTwofaModule } from './components/verify-twofa/verify-twofa.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { WatchRoomComponent } from './pages/watch-room/watch-room.component';
import { WebcamModule } from 'ngx-webcam';
import { Platform } from '@angular/cdk/platform';
import { StreamingComponent } from './pages/streaming/streaming.component';
import { StreamingModule } from './pages/streaming/streaming.module';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { NotificationsService } from './layout/components/navbar/navbar-notification/notifications.service';
import { SettingsComponent } from './pages/settings/settings.component';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import {
  EditorSidebarModule,
  serverValidationMessage,
} from './components/editor-sidebar/editor-sidebar.module';
import { BtnDropdownActionModule } from './components/btn-dropdown-action/btn-dropdown-action.module';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { MatchCardModule } from './components/match-card/match-card.module';
import { FormlyModule } from '@ngx-formly/core';
import { Capacitor } from '@capacitor/core';
import { UpdateModalComponent } from './components/update-modal/update-modal.component';
import { ReleasesComponent } from './pages/releases/releases.component';
import { CheckUpdateComponent } from './pages/settings/check-update/check-update.component';
import { HostListenersModule } from './hostlisteners/host-listeners.module';

@Injectable()
export class CustomMinimaLight {
  name = 'minima-light';
  demoBg = new Color(0x8c8c8c);
}

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { animation: 'home' },
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./pages/registration/registration.module').then(
        (m) => m.RegistrationModule
      ),
  },
  {
    path: 'admin-registration',
    loadChildren: () =>
      import('./pages/admin-registration/admin-registration.module').then(
        (m) => m.AdminRegistrationModule
      ),
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('./pages/teams/teams.module').then((m) => m.TeamModule),
  },

  {
    path: 'leagues',
    loadChildren: () =>
      import('./pages/league-tournament/league-tournament.module').then(
        (m) => m.LeagueTournamentModule
      ),
  },
  {
    path: 'streaming',
    loadChildren: () =>
      import('./pages/streaming/streaming.module').then(
        (m) => m.StreamingModule
      ),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./pages/tables/tables.module').then((m) => m.TablesModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'messages',
    loadChildren: () =>
      import('./pages/messages/messages.module').then((m) => m.MessagesModule),
  },
  {
    path: 'streaming/:match_id/watch/:id',
    component: WatchRoomComponent,
  },
  {
    path: 'watch-room',
    component: WatchRoomComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'check-update',
    component: CheckUpdateComponent,
  },
  {
    path: 'releases',
    component: ReleasesComponent,
  },
];

export type AppThemeVariables = MinimaLight & MinimaDark & CustomMinimaLight;
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WatchRoomComponent,
    SettingsComponent,
    UpdateModalComponent,
    ReleasesComponent,
    CheckUpdateComponent,
  ],
  imports: [
    HostListenersModule,
    CommonModule,
    WebcamModule,
    NgSelectModule,
    AngularFireModule.initializeApp(environment.firebase),
    ProfileModule,
    AngularFireMessagingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    VgStreamingModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !Capacitor.isNativePlatform(),
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ServiceWorkerModule.register('firebase-messaging-sw.js', {
      enabled: !Capacitor.isNativePlatform(),
    }),

    //NgBootstrap
    NgbModule,
    NgbProgressbarModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CoreTouchspinModule,
    CoreDirectivesModule,
    // App modules
    StreamingModule,
    LayoutModule,
    AuthenticationModule,
    ErrorMessageModule,
    ContentHeaderModule,
    ContentBackgroundModule,
    VerifyTwofaModule,

    // Alyle UI modules
    CropperWithDialogModule,
    LyCommonModule,

    // Ngx-videogular
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,

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
  providers: [
    FcmService,
    LyTheme2,
    StyleRenderer,
    NotificationsService,
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDeepDark, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true }, // name minima-light
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {
  constructor() {
    document.documentElement.style.setProperty('--primary', 'red');
  }
}
export function platform(platform: Platform) {
  return platform;
}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
