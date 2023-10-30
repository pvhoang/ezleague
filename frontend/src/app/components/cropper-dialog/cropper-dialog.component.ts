import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { LyDialog } from '@alyle/ui/dialog';
import { ImgCropperConfig, ImgCropperEvent } from '@alyle/ui/image-cropper';

import { CropperDialog } from './cropper-dialog';
import { LyDialogConfig } from '@alyle/ui/dialog/dialog-config';
import { Platform } from '@angular/cdk/platform';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'aui-cropper-with-dialog',
  templateUrl: './cropper-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropperDialogComponent implements OnInit {
  Capacitor = Capacitor;
  isAndroid = Capacitor.getPlatform() === 'android';
  isIOS = Capacitor.getPlatform() === 'ios';
  cropped?: string;
  @Input() overlayImageURL: string;
  @Input() cropper_config: ImgCropperConfig;
  @Input() dialog_config: LyDialogConfig;
  @Input() disabled: boolean = false;
  @Input() capture = null;
  @Input() accept: string = 'image/*';
  @Input() useCropperDialog: boolean = true;
  @Output() croppedImage = new EventEmitter<{
    type: string;
    data: any;
    preview: any;
  }>();
  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
    public platform: Platform
  ) {}

  ngOnInit() {}

  openCropperDialog(event: Event) {
    console.log(event);
    let dialog_config: any = {
      data: {
        event,
        config: this.cropper_config,
        overlayImageURL: this.overlayImageURL,
      },
      width: [420, '100vw@XSmall'],
      height: '100vh@XSmall',
      maxWidth: '100vw@XSmall',
      maxHeight: '90vh@XSmall',
      disableClose: true,
    };
    dialog_config = { ...dialog_config, ...this.dialog_config };
    this.cropped = null!;
    this._dialog
      .open(CropperDialog, dialog_config)
      .afterClosed.subscribe((result?: ImgCropperEvent) => {
        if (result) {
          this.croppedImage.emit({
            type: 'base64',
            data: result.dataURL,
            preview: result.dataURL,
          });
          this._cd.markForCheck();
        }
      });
  }

  onChange(event: Event) {
    if (this.useCropperDialog) {
      this.openCropperDialog(event);
    } else {
      const input = event.target as HTMLInputElement;
      const file = input.files![0];
      if (file) {
        this.getDataUrl(file).then((base64: any) => {
          this.croppedImage.emit({ type: 'file', data: file, preview: base64 });
        });
      }
    }
  }

  getDataUrl(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      reader.onerror = (event: any) => {
        reject(event.target.error);
      };
      reader.readAsDataURL(file);
    });
  }

  onSelectOption(is_capture: any, input: any) {
    this.capture = is_capture;
    setTimeout(() => {
      input.click();
    }, 200);
  }
}
