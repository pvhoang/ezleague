import { ContentHeaderModule } from './../../layout/components/content-header/content-header.module';
import { EventsComponent } from './events/events.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  EditorSidebarModule,
  serverValidationMessage,
} from 'app/components/editor-sidebar/editor-sidebar.module';
import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { ClubsComponent } from './clubs/clubs.component';
import { GroupsComponent } from './groups/groups.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BtnDropdownActionModule } from 'app/components/btn-dropdown-action/btn-dropdown-action.module';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './users/role-permissions/roles/roles.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormsModule } from '@angular/forms';
import { ErrorMessageModule } from 'app/layout/components/error-message/error-message.module';
import { PermissionsGuard } from 'app/guards/permissions.guard';
import { AppConfig } from 'app/app-config';
import { ManageClubComponent } from './clubs/manage-club/manage-club.component';
import { FormlyFieldButton } from 'app/pages/tables/clubs/manage-club/input-button-type.component';
import { LocationsComponent } from './locations/locations.component';

// routing
const routes: Routes = [
  {
    path: 'events',
    component: EventsComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: AppConfig.PERMISSIONS.manage_events },
  },
  {
    path: 'clubs',
    component: ClubsComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: AppConfig.PERMISSIONS.manage_clubs },
  },
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: AppConfig.PERMISSIONS.manage_locations },
  },
  {
    path: 'events/:seasonId/groups',
    component: GroupsComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: AppConfig.PERMISSIONS.manage_groups },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [PermissionsGuard],
    data: { permissions: AppConfig.PERMISSIONS.manage_users },
  },
];

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [
    EventsComponent,
    ClubsComponent,
    GroupsComponent,
    UsersComponent,
    RolesComponent,
    ManageClubComponent,
    FormlyFieldButton,
    LocationsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EditorSidebarModule,
    CoreSidebarModule,
    CoreCommonModule,
    DataTablesModule,
    ContentHeaderModule,
    TranslateModule,
    CoreCommonModule,
    NgbDropdownModule,
    BtnDropdownActionModule,
    ErrorMessageModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'inputButton',
          component: FormlyFieldButton,
          wrappers: ['form-field'],
          defaultOptions: {
            props: {
              type: 'button',
            },
          },
        },
      ],
      validationMessages: [
        { name: 'serverError', message: serverValidationMessage },
      ],
    }),
    FormsModule,
  ],
  exports: [EventsComponent, ClubsComponent],
})
export class TablesModule {}
