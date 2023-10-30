import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreConfigService } from '@core/services/config.service';
import { menu } from 'app/menu/menu';
import { AuthService } from 'app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  public contentHeader: object;

  constructor(
    private _coreConfigService: CoreConfigService,
    public _authService: AuthService,
    private _router: Router,
    public _coreMenuService: CoreMenuService
  ) {
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: false,
        },
        menu: {
          hidden: false,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: true,
      },
    };
  }

  onClick() {
    Swal.fire({
      title: 'Click',
      text: 'You clicked the button!',
      icon: 'success',
      confirmButtonText: 'Cool',
    });
  }

  ngOnInit() {
    this._authService.getProfile().subscribe((data) => {
      // console.log('data', data);
      this._coreMenuService.unregister('main');
      this._coreMenuService.register('main', menu);
      this._coreMenuService.setCurrentMenu('main');

      // redirect to fixtues & results page if user is guest
      if (data.role.id == 7) {
        this._router.navigate(['/leagues/fixtures-results']);
      }
    });
  }
}
