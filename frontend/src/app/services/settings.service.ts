import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  customFieldsSubject: Subject<any> = new Subject<any>();
  customFieldsValue: any[] = [];
  initSettingsValue: any = {};
  initSettingsSubject: Subject<any> = new Subject<any>();
  systemSettingsSubject: Subject<any> = new Subject<any>();
  defaultFields: any = [
    {
      type: 'input',
      key: 'first_name',
      props: {
        translate: true,
        label: 'Surname',
        required: true,
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      type: 'input',
      key: 'last_name',
      props: {
        translate: true,
        label: 'Other names',
        required: true,
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      type: 'image-cropper',
      key: 'photo',
      props: {
        translate: true,
        label: 'Player photo',
        required: true,
        upload_url: `${environment.apiUrl}/files/editor`,
        accept: 'image/png,image/jpg,image/jpeg',
        useCropperDialog: true,
        config: {
          width: 600,
          height: 800,
          resizableArea: false,
          output: { width: 600, height: 800 },
        },
        test_image: 'assets/images/example_uploads/avatar.jpg',
      },
    },
    {
      type: 'input',
      key: 'dob',
      props: {
        translate: true,
        label: 'Date of birth',
        required: true,
        type: 'date',
      },
    },
    {
      type: 'radio',
      key: 'gender',
      props: {
        translate: true,
        label: 'Gender',
        required: true,
        options: [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
        ],
      },
      defaultValue: 'Male',
    },
    {
      type: 'radio',
      key: 'document_type',
      props: {
        translate: true,
        label: 'Document type',
        required: true,
        type: 'select',
        options: [
          { value: 'HKID', label: 'HKID' },
          { value: 'Passport', label: 'Passport' },
        ],
      },
      defaultValue: 'HKID',
    },
    {
      type: 'image-cropper',
      key: 'document_photo',
      props: {
        translate: true,
        label: 'Document photo',
        required: true,
        upload_url: `${environment.apiUrl}/files/editor`,
        accept: 'image/png,image/jpg,image/jpeg',
        useCropperDialog: true,
        config: {
          width: 900,
          height: 600,
          resizableArea: false,
          output: { width: 900, height: 600 },
        },
        test_image: 'assets/images/example_uploads/hkid.jpg',
      },
    },
    {
      type: 'input',
      key: 'document_expiry_date',
      props: {
        translate: true,
        label: 'Document expiry date',
        required: false,
        type: 'date',
      },
      expressions: {
        'props.required': "model.document_type === 'Passport'",
        hide: "model.document_type === 'HKID'",
      },
    },
    {
      type: 'ng-select',
      key: 'club_id',
      props: {
        translate: true,
        label: 'Club',
        required: true,
        closeOnSelect: true,
        options: [],
        placeholder: 'Select Club',
      },
    },
  ];

  constructor(
    public _http: HttpClient,
    public _loadingService: LoadingService
  ) {
    this.customFieldsSubject.subscribe((res) => {
      this.customFieldsValue = res;
    });
    this.initSettingsSubject.subscribe((res) => {
      this.initSettingsValue = res;
      console.log('initSettingsValue: ', this.initSettingsValue);
    });
  }

  getCustomFields() {
    console.log('getCustomFields');
    let custom_fields = localStorage.getItem('custom_fields');
    if (custom_fields) {
      this.customFieldsSubject.next(JSON.parse(custom_fields));
    } else {
      this.getInitSettings();
    }
  }

  get customFields() {
    return this.customFieldsSubject.asObservable();
  }

  get initSettings() {
    return this.initSettingsSubject.asObservable();
  }

  getSettingsData() {
    return this.systemSettingsSubject.asObservable();
  }

  refreshSettings() {
    this.getSettings();
  }

  getInitSettings(from_storage = true) {
    console.log('getSettings');
    if (from_storage) {
      let initSettings = localStorage.getItem('initSettings');
      if (initSettings) {
        initSettings = JSON.parse(initSettings);
        this.initSettingsSubject.next(initSettings);
        return this.initSettingsSubject;
      }else{
        from_storage = false;
      }
    } 
    
    if(!from_storage) {
      return this._http
        .get(`${environment.apiUrl}/settings/init-json`)
        .subscribe(
          (res: any) => {
            let fields = this.defaultFields;
            if (res.hasOwnProperty('custom_fields') && res.custom_fields) {
              res.custom_fields.forEach((element) => {
                if (element.type == 'image-cropper') {
                  element.props.upload_url = `${environment.apiUrl}/files/editor`;
                }
              });
              // concat default fields with custom fields
              fields = fields.concat(res.custom_fields);
            }
            // console.log('fields: ',fields);
            localStorage.setItem('custom_fields', JSON.stringify(fields));
            localStorage.setItem('initSettings', JSON.stringify(res));
            this.customFieldsSubject.next(fields);
            this.initSettingsSubject.next(res);
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  getSettings() {
    this._loadingService.show();
    console.log('getSettings');
    return this._http.get(`${environment.apiUrl}/settings`).subscribe(
      (res: any) => {
        this.systemSettingsSubject.next(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateSettings(key, data: any) {
    let form_data = new FormData();
    form_data.append('key', key);
    form_data.append('value', JSON.stringify(data));

    return this._http.post(`${environment.apiUrl}/settings`, form_data).pipe(
      map((res: any) => {
        this.systemSettingsSubject.next(res);
        return res;
      })
    );
  }

  getRequiredVersion() {
    return this._http
      .get(`${environment.apiUrl}/settings/required-version`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
