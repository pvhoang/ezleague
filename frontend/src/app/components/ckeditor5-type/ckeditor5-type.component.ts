import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-ckeditor5-type',
  templateUrl: './ckeditor5-type.component.html',
  styleUrls: ['./ckeditor5-type.component.scss'],
  standalone: true,
  imports: [CKEditorModule],
  encapsulation: ViewEncapsulation.None,
})
export class Ckeditor5TypeComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  @ViewChild('editor') editorComponent: CKEditorComponent;
  // public Editor = Editor;
  public Editor;

  constructor() {
    super();
  }
  getEditor() {
    // Warning: This may return "undefined" if the editor is hidden behind the `*ngIf` directive or
    // if the editor is not fully initialised yet.
    return this.editorComponent.editorInstance;
  }
  onChange({ editor }: any) {
    const data = editor.getData();
    this.formControl.setValue(data);
    // console.log('formControl', this.formControl);
  }
  /**
   * config: {
   *      toolbar: ['heading', '|', 'bold', 'italic'],
   *      htmlSupport: {
   *        allow: [
   *          {
   *            name: /./,
   *            attributes: true,
   *            classes: true,
   *            styles: true,
   *          },
   *        ],
   *      },
   *      htmlEmbed: {
   *        showPreviews: true,
   *      },
   *      mention: {
   *        feeds: [
   *          {
   *            marker: '{',
   *            feed: this.getFeedItems,
   *            minimumCharacters: 1,
   *          },
   *        ],
   *      },
   *    },
   *  }
   *
   *  getFeedItems(queryText) {
   *    return new Promise((resolve) => {
   *      setTimeout(() => {
   *        const itemsToDisplay = [
   *        '{{user.id}}',
   *        '{{user.name}}',
   *        '{{user.email}}',
   *        ]
   *        .filter(isItemMatching)
   *        .slice(0, 10);
   *        resolve(itemsToDisplay);
   *     }, 100);
   *    });
   *    function isItemMatching(item) {
   *      const searchString = queryText.toLowerCase();
   *      return item.toLowerCase().includes(searchString);
   *      // ||        item.id.toLowerCase().includes(searchString)
   *    }
   *}
   */
  ngOnInit(): void {
    // console.log('ngOnInit', this.field);
    // console.log('props', this.to);
  }
}
