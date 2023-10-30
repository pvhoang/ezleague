import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { AuthService } from 'app/services/auth.service';
import { menu } from 'app/menu/menu';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _coreMenuService: CoreMenuService,
    public _authService: AuthService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // filter menu by permissions
  filterMenuByPermissions(permissions) {
    if (!permissions) {
      return [];
    }
    permissions = permissions.map((item) => item.id);
    // console.log('permissions', permissions);
    let neu_menu = JSON.parse(JSON.stringify(menu));
    // console.log('before menu', neu_menu);
    let after_menu = neu_menu.filter((item) => {
      if (item.children) {
        item.children = item.children.filter((child) => {
          if (child.permissions) {
            return child.permissions.some((permission) =>
              permissions.includes(permission)
            );
          } else {
            return true;
          }
        });
      }
      if (item.permissions) {
        return item.permissions.some((permission) =>
          permissions.includes(permission)
        );
      }
      if (item.children?.length < 1) {
        return false;
      }
      return true;
    });
    // console.log('after menu', after_menu);
    return after_menu;
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the menu either from the input or from the service
    // this.menu = this.menu || this._coreMenuService.getCurrentMenu();
    this.menu = this.filterMenuByPermissions(
      this._authService.currentUserValue?.role.permissions
    );
    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._authService.currentUser.subscribe((x) => {
          this.currentUser = x;
        });

        // Load menu
        // this.menu = this._coreMenuService.getCurrentMenu();
        // filter menu by permissions
        this.menu = this.filterMenuByPermissions(
          this._authService.currentUserValue?.role.permissions
        );

        this._changeDetectorRef.markForCheck();
      });
  }
}
