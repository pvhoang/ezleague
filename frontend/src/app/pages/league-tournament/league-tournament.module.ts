import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueComponent } from './league/league.component';
import { LeagueReportsComponent } from './league-reports/league-reports.component';
import { Routes, RouterModule } from '@angular/router';
import {
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
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
import { StagesComponent } from './stages/stages.component';
import { StageDetailsComponent } from './stages/stage-details/stage-details.component';
import { FormlyConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NumberTypeComponent } from 'app/components/number-type/number-type.component';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { DetailsWrapperComponent } from './stages/stage-details/details-wraper.component';
import { StageTablesComponent } from './stages/stage-tables/stage-tables.component';
import { StageTeamsComponent } from './stages/stage-teams/stage-teams.component';
import { ModalAddGroupTeamComponent } from './stages/stage-teams/modal-add-group-team/modal-add-group-team.component';
import { StageMatchesComponent } from './stages/stage-matches/stage-matches.component';
import { LeagueMatchesComponent } from './league-matches/league-matches.component';
import { ScrollableTabsModule } from 'app/components/scrollable-tabs/scrollable-tabs.module';
import { UpadateMatchesComponent } from './league-matches/update-matches/update-matches.component';
import { ModalUpdateScoreComponent } from './modal-update-score/modal-update-score.component';
import { UpdateMatchDetailsComponent } from './modal-update-match-details/update-match-details.component';
import { FixturesResultsComponent } from './fixtures-results/fixtures-results.component';
import { FixturesComponent } from './fixtures-results/fixtures/fixtures.component';
import { MatchCardModule } from 'app/components/match-card/match-card.module';
import { MatchesDetailsComponent } from './fixtures-results/matches-details/matches-details.component';
import { MatchDetailsGuard } from 'app/guards/match-details.guard';
import { HostListenersModule } from 'app/hostlisteners/host-listeners.module';

const routes: Routes = [
  {
    path: 'manage',
    component: LeagueComponent,
  },
  {
    path: 'manage/:tournament_id/stages/:stage_id',
    component: StagesComponent,
  },
  {
    path: 'reports',
    component: LeagueReportsComponent,
  },
  {
    path: 'matches',
    component: LeagueMatchesComponent,
  },
  {
    path: 'matches/:match_id/update-details',
    component: UpadateMatchesComponent,
  },
  {
    path: 'matches/:match_id/details',
    component: MatchesDetailsComponent,
    canActivate: [MatchDetailsGuard],
  },
  {
    path: 'fixtures-results',
    component: FixturesResultsComponent,
  },
];

@NgModule({
  declarations: [
    LeagueComponent,
    StagesComponent,
    LeagueReportsComponent,
    StageDetailsComponent,
    NumberTypeComponent,
    DetailsWrapperComponent,
    StageTablesComponent,
    StageTeamsComponent,
    ModalAddGroupTeamComponent,
    StageMatchesComponent,
    LeagueMatchesComponent,
    UpadateMatchesComponent,
    MatchesDetailsComponent,
    ModalUpdateScoreComponent,
    UpdateMatchDetailsComponent,
    FixturesResultsComponent,
    FixturesComponent,
  ],
  imports: [
    HostListenersModule,
    CoreCommonModule,
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
    ScrollableTabsModule,
    NgbCollapseModule,
    FormlyBootstrapModule,
    MatchCardModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'serverError', message: serverValidationMessage },
      ],
      wrappers: [{ name: 'details', component: DetailsWrapperComponent }],
    }),
  ],
  exports: [
    LeagueComponent,
    StagesComponent,
    LeagueReportsComponent,
    NumberTypeComponent,
    ModalUpdateScoreComponent,
    UpdateMatchDetailsComponent,
  ],
})
export class LeagueTournamentModule {}
