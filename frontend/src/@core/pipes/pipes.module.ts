import { NgModule } from '@angular/core';

import { FilterPipe } from '@core/pipes/filter.pipe';

import { InitialsPipe } from '@core/pipes/initials.pipe';

import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from '@core/pipes/stripHtml.pipe';
import { DotStringPipe } from '@core/pipes/dotstring.pipe';

@NgModule({
  declarations: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe,DotStringPipe],
  imports: [],
  exports: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe,DotStringPipe]
})
export class CorePipesModule {}
