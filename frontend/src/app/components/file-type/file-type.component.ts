import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { LoadingService } from 'app/services/loading.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'formly-field-file',
  templateUrl: './file-type.component.html',
})
export class FormlyFieldFile
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  constructor(
    public _http: HttpClient,
    public _loadingService: LoadingService
  ) {
    super();
  }

  @ViewChild('fileInput') fileInput: any;
  public uploaded: boolean = false;
  hidden: boolean = false;
  values = [];
  files = [];
  ngOnInit() {
    if (this.field.props.uploaded) {
      this.uploaded = true;
      if (this.formControl.value) {
        this.values = this.formControl.value.split('|');
      }
    }
    if (this.field.props.hidden_input) {
      this.hidden = true;
    }
  }

  onChange($event) {
    console.log('onChange', $event);
    if (!this.to.multiple && this.values.length > 0) {
      this.values = [];
      this.files = [];
    }
    // upload file to server
    this.field.props.upload_url = this.field.props.upload_url
      ? this.field.props.upload_url
      : `${environment.apiUrl}/files/editor`;
    if ($event.target.files.length > 0 && this.field.props.upload_url) {
      // foreach file
      let files = $event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.uploadFile(files[i]);
      }
    } else {
      this.formControl.setValue('');
    }
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append('upload', file);
    formData.append('uploadField', this.field.key as any);
    formData.append('action', 'upload');
    if (this.to.custom_params) {
      Object.keys(this.to.custom_params).forEach((key) => {
        let value = this.to.custom_params[key];
        // if in value like model.field then get value from model
        if (value.indexOf('model.') !== -1) {
          let field = value.replace('model.', '');
          value = this.model[field];
        }
        formData.append(key, value);
      });
    }
    this._loadingService.show();
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
          // add files to this.files
          this.files.push(files[key_file]);
          // get current value
          this.values.push(url);
          let value = this.values.join('|');
          console.log('value', value);
          this.formControl.setValue(value);

          console.log('values', this.values);
          console.log('files', this.files);
        }
      });
  }

  removeFile(index) {
    // remove file from this.files
    this.files.splice(index, 1);
    // remove file from this.values
    this.values.splice(index, 1);
    // update formControl value
    this.formControl.setValue(this.values.join('|'));
    // reset formControl if no files
    if (this.files.length === 0) {
      this.formControl.setValue('');
      this.uploaded = false;
      // reset input file
      this.fileInput.nativeElement.value = '';
    }
  }

  onClick($event) {
    // if environment is local, then set the value to assets/images/logo/ezactive_1024x1024.png
    if (environment.production === false) {
      this.uploaded = true;
      this.formControl.setValue('assets/images/logo/ezactive_1024x1024.png');
      // close browser file dialog
      $event.target.value = null;
    }
  }
}
