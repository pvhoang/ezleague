import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'badge-live',
  template: `<span class="badge badge-danger mr-1">
    <tr>
      <td class="d-table-cell align-middle" style="padding-right: 5px;">
        LIVE
      </td>
      <td class="livenow livenow-{{ icon_size }}">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </td>
    </tr>
  </span>`,
  encapsulation: ViewEncapsulation.None,
})
export class BadgeLiveComponent {
  @Input() icon_size: string = 'sm';
}
