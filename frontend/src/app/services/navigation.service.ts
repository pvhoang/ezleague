import { Injectable } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = [];
  constructor(
    public _coreSidebarService: CoreSidebarService,
    private router: Router,
    public location: Location
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  back() {
    // check sidebars and close them if they are open
    let registerSidebars = this._coreSidebarService.sidebarRegistry;
    // for loop object
    for (let key in registerSidebars) {
      if (registerSidebars[key].isOpened) {
        this._coreSidebarService.getSidebarRegistry(key).close();
        return;
      }
    }
    // check history and navigate back
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
