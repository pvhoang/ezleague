import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { ContentBackgroundComponent } from './content-background.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ContentBackgroundComponent],
  imports: [RouterModule, CoreCommonModule, TranslateModule],
  exports: [ContentBackgroundComponent],
})
export class ContentBackgroundModule {}
