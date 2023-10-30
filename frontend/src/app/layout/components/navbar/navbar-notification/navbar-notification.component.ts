import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';

// Interface
interface notification {
  messages: [];
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html',
})
export class NavbarNotificationComponent implements OnInit {
  // Public
  public notifications: any;
  selectedMessage: any;
  @ViewChild('modalRef') modalRef: any;
  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(
    private _notificationsService: NotificationsService,
    public _modalService: NgbModal
  ) {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._notificationsService.onApiDataChange.subscribe((res) => {
      this.notifications = res;
    });
  }

  maskAllAsRead() {
    if (this.notifications.length > 0) {
      this._notificationsService.maskAllAsRead();
    }
  }

  markAsRead(message) {
    this._notificationsService.markAsRead(message);
  }

  modalOpen(message) {
    this.selectedMessage = message;
    this._modalService.open(this.modalRef);
    this.markAsRead(message);
  }
}
