import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

export class TranslateExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}
  prePopulate(field: FormlyFieldConfig) {
    const props = field.props || {};
    if (!props.translate || props._translated) {
      return;
    }

    props._translated = true;
    field.expressions = {
      ...(field.expressions || {}),
      'props.label': (props.label? this.translate.stream(props.label):props.label ),
    };
    // translate placeholder
    if (props.placeholder) {
      field.props.placeholder = this.translate.instant(props.placeholder);
    }
    // translate options
    if (props.options) {
      props.options.forEach((option: any) => {
        option.label = this.translate.instant(option.label);
      });
    }
  }
}

export function registerTranslateExtension(translate: TranslateService) {
  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          return translate.stream('FORM.VALIDATION.REQUIRED');
        },
      },
    ],
    extensions: [
      {
        name: 'translate',
        extension: new TranslateExtension(translate),
      },
    ],
  };
}

/**  Copyright 2021 Formly. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://github.com/ngx-formly/ngx-formly/blob/main/LICENSE */
