import { ImgCropperConfig } from '@alyle/ui/image-cropper';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { LoadingService } from 'app/services/loading.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-image-cropper-type',
  templateUrl: './image-cropper-type.component.html',
  styleUrls: ['./image-cropper-type.component.scss'],
})
export class ImageCropperTypeComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  constructor(
    public _http: HttpClient,
    public _loadingService: LoadingService
  ) {
    super();
  }
  uploaded = false;
  public image_src = '';
  environment = environment;
  onCropedPhoto(event) {
    let type = event.type;
    this.image_src = event.preview;
    let file = type == 'file' ? event.data : this.base64ToFile(event.data);
    this.submitFile(file);
  }

  onClick($event) {
    // if environment is local, then set the value to assets/images/logo/ezactive_1024x1024.png
    if (environment.production === false) {
      this.uploaded = true;
      if (this.to.hasOwnProperty('test_image')) {
        this.formControl.setValue(this.to.test_image);
      } else {
        this.formControl.setValue('assets/images/ico/icon-72x72.png');
      }
      // close browser file dialog
      $event.target.value = null;
    }
  }

  submitFile(file) {
    const formData = new FormData();
    formData.append('upload', file);
    formData.append('uploadField', this.field.key as any);
    formData.append('action', 'upload');
    this._loadingService.show();
    this.field.props.upload_url = this.field.props.upload_url
      ? this.field.props.upload_url
      : `${environment.apiUrl}/files/editor`;
    if (this.field.props.hasOwnProperty('upload_url')) {
      this._http
        .post(this.field.props.upload_url, formData)
        .subscribe((res: any) => {
          this.uploaded = true;
          if (res.hasOwnProperty('fieldErrors')) {
            res.fieldErrors.forEach((fieldError: any) => {
              if (fieldError.name === this.field.key) {
                this.formControl.setErrors({ serverError: fieldError.status });
              }
            });
          } else if (res.hasOwnProperty('files')) {
            let files = res.files.files;
            let key_file = Object.keys(files)[0];
            let url = files[key_file].url;
            this.formControl.setValue(url);
          }
        });
    }
  }

  // convert base64 to file
  base64ToFile(dataurl, filename?) {
    let timestamp = new Date().getTime();
    filename = filename || `image_${timestamp}`;
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    filename = filename + '.' + mime.split('/')[1];
    return new File([u8arr], filename, { type: mime });
  }

  configPhoto: ImgCropperConfig = {
    width: 250,
    height: 250,
    resizableArea: false,
    output: {
      width: 250,
      height: 250,
    },
  };

  ngOnInit(): void {
    this.field.props['useCropperDialog'] = this.field.props.hasOwnProperty(
      'useCropperDialog'
    )
      ? this.field.props.useCropperDialog
      : true;
    this.image_src = this.formControl.value;
    this.formControl.valueChanges.subscribe((value) => {
      if (!value) {
        this.uploaded = false;
      }
      this.image_src = value;
    });
    if (this.field.props.hasOwnProperty('config')) {
      // merge config
      this.configPhoto = { ...this.configPhoto, ...this.field.props.config };
    }
  }
}
