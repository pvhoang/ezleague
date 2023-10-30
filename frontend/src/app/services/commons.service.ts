import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { coreConfig } from 'app/app-config';

@Injectable({
  providedIn: 'root',
})
export class CommonsService {
  public dataTableDefaults = {
    dom: 'B<"row ml-2 mr-2"<"col-3 p-0"l><"col-12 p-0 col-md-9 col-lg-9 d-flex d-md-block d-lg-block"f>>rt<"row pl-2 pr-2"<"col-md-6 col-12"i><"col-md-6 col-12"p>>',
    dom_m25:
      'B<"row ml-25 mr-25"<"col-3 p-0"l><"col-12 p-0 col-md-9 col-lg-9 d-flex d-md-block d-lg-block"f>>rt<"row pl-25 pr-25"<"col-md-6 col-12"i><"col-md-6 col-12"p>>',
    buttons: {
      dom: {
        container: { className: 'dt-buttons ml-2 mb-1' },
        button: { className: 'btn btn-primary mt-25' },
      },
    },
    lengthMenu: [
      [10, 25, 50, 100, 200, 500, 1000, -1],
      [10, 25, 50, 100, 200, 500, 1000, this._translateService.instant('All')],
    ],
    lang: {
      decimal: '',
      emptyTable: this._translateService.instant('No data available in table'),
      info: this._translateService.instant(
        'Showing _START_ to _END_ of _TOTAL_ entries'
      ),
      infoEmpty: this._translateService.instant('Showing 0 to 0 of 0 entries'),
      infoFiltered: this._translateService.instant(
        '(filtered from _MAX_ total entries)'
      ),
      infoPostFix: '',
      thousands: ',',
      lengthMenu: this._translateService.instant('Show _MENU_ entries'),
      loadingRecords: `${this._translateService.instant('Loading')}...`,
      processing: this._translateService.instant('Processing...'),
      search: `${this._translateService.instant('Search')}:`,
      zeroRecords: this._translateService.instant('No matching records found'),
      paginate: {
        first: this._translateService.instant('First'),
        last: this._translateService.instant('Last'),
        next: "<i class=''></i>",
        previous: "<i class=''></i>",
      },
      select: {
        rows: {
          _: this._translateService.instant('Selected %d rows'),
          0: this._translateService.instant('Click a row to select'),
          1: this._translateService.instant('Selected 1 row'),
        },
      },
    },
  };

  public regex_english_name: RegExp = /^[a-z]+(([\',.-]?[ ]?[a-z])?[a-z]*)*$/i;
  public regex_chinese_name: RegExp =
    /^[a-zA-Z \u3400-\u9fa5\ufeff\u00A0\u202F\uFF0C]*$/u;
  // public regex_name: RegExp =
  // /^[a-zA-Z\u3400-\u9fa5\u00C0-\u1EF9\ufeff\u00A0\u202F\uFF0C]+(([\'’,. -][a-z \u3400-\u9fa5\u00C0-\u1EF9\ufeff\u00A0\u202F\uFF0C])?[a-z \u3400-\u9fa5\u00C0-\u1EF9\ufeff\u00A0\u202F\uFF0C]*)*$/i;
  public regex_name: RegExp =
    /^\p{L}([.,'’-]?\s?[\p{L}\p{M}]+)*[\p{L}\p{M}]*$/u;
  constructor(public _translateService: TranslateService) {}
  removeSpaceInName(str) {
    let strArray = str.split(' ');
    let newStr = '';
    //join string together if there is not space
    if (strArray.length == 1) {
      newStr = strArray[0];
    } else {
      for (let i = 0; i < strArray.length; i++) {
        if (strArray[i] != '') {
          // newStr +=strArray[i].charAt(0).toUpperCase() + strArray[i].slice(1) + ' ';
          newStr += strArray[i] + ' ';
        }
      }
    }
    return (str = newStr.trim());
  }

  saveState(tableId, table) {
    localStorage.setItem(tableId, JSON.stringify(table.state()));
  }

  loadState(tableId) {
    let state = localStorage.getItem(tableId);
    if (state) {
      return JSON.parse(state);
    }
  }
  onloadImgErr(event) {
    event.target.src = coreConfig.app.appLogoImage;
  }
}
