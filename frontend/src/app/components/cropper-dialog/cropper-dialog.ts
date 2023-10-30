import { Component, ChangeDetectionStrategy, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { StyleRenderer, WithStyles, lyl, ThemeRef, ThemeVariables } from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { LySliderChange, STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import {
  STYLES as CROPPER_STYLES,
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent
} from '@alyle/ui/image-cropper';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(SLIDER_STYLES);
  ref.renderStyleSheet(CROPPER_STYLES);
  const slider = ref.selectorsOf(SLIDER_STYLES);
  const cropper = ref.selectorsOf(CROPPER_STYLES);

  return {
    root: lyl `{
      ${cropper.root} {
        max-width: 100vw
        height: 60vh
        min-height: 300px
      }
    }`,
    sliderContainer: lyl `{
      position: relative
      ${slider.root} {
        width: 80%
        position: absolute
        left: 0
        right: 0
        margin: auto
        top: -45px
      }
    }`,
    slider: lyl `{
      padding: 1em
    }`
  };
};

@Component({
  templateUrl: './cropper-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class CropperDialog implements WithStyles, AfterViewInit {

  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  ready: boolean;
  scale: number;
  minScale: number;
  @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 900,
    height: 600,
    // type: 'image/png',
    keepAspectRatio: true,
    responsiveArea: true,
    output: {
      width: 200,
      height: 200
    },
    resizableArea: true
  };

  constructor(
    @Inject(LY_DIALOG_DATA) private event: any,
    readonly sRenderer: StyleRenderer,
    public dialogRef: LyDialogRef
  ) {
    console.log(event);
    this.myConfig = { ...this.myConfig, ...event.config };
   }

   addOverlayImage(){
    if(!this.event.overlayImageURL) return;
    console.log(this.event.overlayImageURL);
    
    // get element have tag ly-img-cropper
    const element = document.querySelector('ly-img-cropper');
    // create new div
    const div = document.createElement('div');
    div.id = 'image-backdrop';
    // set style for div
    div.style.position = 'absolute';
    div.style.top = '-20px';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.background = `url(${this.event.overlayImageURL})`;
    div.style.backgroundSize = 'contain';
    div.style.backgroundRepeat = 'no-repeat';
    div.style.backgroundPosition = 'center';
    div.style.pointerEvents = 'none';
    // add div to element
    element.appendChild(div);
   }

  ngAfterViewInit() {
    // Load image when dialog animation has finished
    this.dialogRef.afterOpened.subscribe(() => {
      this.cropper.selectInputEvent(this.event.event);
    });
    this.addOverlayImage();
  }

  onCropped(e: ImgCropperEvent) {
    console.log('cropped img: ', e);
  }
  onLoaded(e: ImgCropperEvent) {
    console.log('img loaded', e);
  }
  onError(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
    // Close the dialog if it fails
    this.dialogRef.close();
  }

  onSliderInput(event: LySliderChange) {
    this.scale = event.value as number;
  }

}
