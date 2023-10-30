import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';

import { CropperDialogComponent } from './cropper-dialog.component';
import { CropperDialog } from './cropper-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    CropperDialogComponent,
    CropperDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule,
    TranslateModule,
    NgbDropdownModule
  ],
  exports: [CropperDialogComponent]
})
export class CropperWithDialogModule { }
