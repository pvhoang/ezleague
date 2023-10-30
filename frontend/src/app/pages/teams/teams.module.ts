import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TeamsComponent } from './teams.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageModule } from 'app/layout/components/error-message/error-message.module';
import { CoreSidebarModule } from '@core/components';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamManagementComponent } from './team-management/team-management.component';
import { DataTablesModule } from 'angular-datatables';
import { EditorSidebarModule } from 'app/components/editor-sidebar/editor-sidebar.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AvailablePlayerModalComponent } from './team-assignment/assign-players/available-player-modal/available-player-modal.component';
import { AssignNewCoachComponent } from './team-assignment/assign-coaches/assign-new-coach/assign-new-coach.component';
import { BtnDropdownActionModule } from 'app/components/btn-dropdown-action/btn-dropdown-action.module';
import { TeamsheetTemplateComponent } from './teamsheet-template/teamsheet-template.component';
import { TeamSelectionComponent } from './team-selection/team-selection.component';
import { TeamAssignmentComponent } from './team-assignment/team-assignment.component';
import { TeamCoachesComponent } from './team-assignment/assign-coaches/assign-coaches.component';
import { TeamPlayersComponent } from './team-assignment/assign-players/assign-players.component';
import { TeamSheetsComponent } from './teamsheets/teamsheets.component';
import { ModalTeamsheetHistoryComponent } from './teamsheets/modal-teamsheet-history/modal-teamsheet-history.component';

const routes: Routes = [
  {
    path: 'team-management',
    component: TeamManagementComponent,
  },
  {
    path: 'team-assignment',
    component: TeamSelectionComponent,
  },
  {
    path: 'team-assignment/:teamId',
    component: TeamAssignmentComponent,
  },
  {
    path: 'teamsheets',
    component: TeamSheetsComponent,
  },
];

@NgModule({
  declarations: [
    TeamsComponent,
    TeamManagementComponent,
    AvailablePlayerModalComponent,
    AssignNewCoachComponent,
    TeamsheetTemplateComponent,
    TeamSelectionComponent,
    TeamAssignmentComponent,
    TeamCoachesComponent,
    TeamPlayersComponent,
    TeamSheetsComponent,
    ModalTeamsheetHistoryComponent,
  ],
  imports: [
    NgbModule,
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
  ],
  exports: [
    TeamsComponent,
    TeamManagementComponent,
    AvailablePlayerModalComponent,
    AssignNewCoachComponent,
    TeamsheetTemplateComponent,
    TeamSheetsComponent,
    ModalTeamsheetHistoryComponent,
  ],
})
export class TeamModule {}
