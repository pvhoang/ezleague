import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss'],
})
export class AllNotificationsComponent implements OnInit {
  public contentHeader: object;
  notificationsData: any = [];
  filter: any = null;
  constructor(
    public _notficationsService: NotificationsService,
    public _translateService: TranslateService
  ) {
    this.getAllNotifications();
    this.contentHeader = {
      headerTitle: _translateService.instant('All Notifications'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [],
      },
    };
  }

  getAllNotifications() {
    this._notficationsService.getAllNotifications().subscribe((res: any) => {
      this.notificationsData = res.messages;
      console.log(this.notificationsData);
    });
  }

  ngOnInit(): void {}
  tabClick(type) {
    switch (type) {
      case 'all':
        this.filter = null;
        break;
      case 'unread':
        this.filter = '0';
        break;
    }
    console.log(this.filter);
  }

  isString(val) {
    return typeof val === 'string';
  }
}
