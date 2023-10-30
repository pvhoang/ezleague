import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StreamingComponent } from './streaming.component';
import { CoreCommonModule } from '@core/common.module';
import {
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageModule } from 'app/layout/components/error-message/error-message.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoreSidebarModule } from '@core/components';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorSidebarModule } from 'app/components/editor-sidebar/editor-sidebar.module';
import { BtnDropdownActionModule } from 'app/components/btn-dropdown-action/btn-dropdown-action.module';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { ScrollableTabsModule } from 'app/components/scrollable-tabs/scrollable-tabs.module';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { BadgeLiveModule } from 'app/components/widget/badge-live/badge-live.module';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { ViewBroadcastComponent } from './view-broadcast/view-broadcast.component';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { TourNgBootstrapModule } from 'ngx-ui-tour-ng-bootstrap';
import { HostListenersModule } from 'app/hostlisteners/host-listeners.module';
const routes: Routes = [
  {
    path: 'streaming',
    component: StreamingComponent,
    data: { title: 'Profile' },
  },
  {
    path: 'streaming/broadcast/:id',
    component: BroadcastComponent,
  },
  {
    path: 'streaming/:match_id/watch/:id',
    component: ViewBroadcastComponent,
  },
];

@NgModule({
  declarations: [
    StreamingComponent,
    BroadcastComponent,
    ViewBroadcastComponent,
  ],
  imports: [
    HostListenersModule,
    CommonModule,
    CoreCommonModule,
    NgbAccordionModule,
    NgbModule,
    NgSelectModule,
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
    NgbTimepickerModule,
    NgbNavModule,
    BadgeLiveModule,
    CoreTouchspinModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    TourNgBootstrapModule.forRoot(),
  ],
  exports: [BroadcastComponent, StreamingComponent, ViewBroadcastComponent],
})
export class StreamingModule {}
