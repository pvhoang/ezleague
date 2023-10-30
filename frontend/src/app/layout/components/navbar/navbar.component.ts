import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppConfig } from './../../../app-config';
import {
  Component,
  OnDestroy,
  OnInit,
  HostBinding,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'app/services/auth.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreMediaService } from '@core/services/media.service';

import { User } from 'app/interfaces/user';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { LoadingService } from 'app/services/loading.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit, OnDestroy {
  public horizontalMenu: boolean;
  public hiddenMenu: boolean;

  public coreConfig: any;
  public currentSkin: string;
  public prevSkin: string;
  public appConfig = AppConfig;

  public currentUser: User;

  public languageOptions = [];
  public navigation: any;
  public selectedLanguage: any;

  @HostBinding('class.fixed-top')
  public isFixed = false;

  @HostBinding('class.navbar-static-style-on-scroll')
  public windowScrolled = false;

  // Add .navbar-static-style-on-scroll on scroll using HostListener & HostBinding
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop > 100) &&
      this.coreConfig.layout.navbar.type == 'navbar-static-top' &&
      this.coreConfig.layout.type == 'horizontal'
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authService
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CoreMediaService} _coreMediaService
   * @param {MediaObserver} _mediaObserver
   * @param {TranslateService} _translateService
   */
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _coreConfigService: CoreConfigService,
    private _coreMediaService: CoreMediaService,
    private _coreSidebarService: CoreSidebarService,
    private _mediaObserver: MediaObserver,
    public _translateService: TranslateService,
    private _toastrService: ToastrService,
    private _router: Router,
    private _loadingService: LoadingService
  ) {
    this._authService.currentUser.subscribe((x) => (this.currentUser = x));

    AppConfig.LANGUAGES.forEach((language) => {
      this.languageOptions[language.code] = {
        title: language.name,
        flag: language.flag,
      };
    });
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    console.log('router', this._router.url);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebar(key): void {
    this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }

  /**
   * Set the language
   *
   * @param language
   */
  setLanguage(language): void {
    // Set the selected language for the navbar on change
    this.selectedLanguage = language;

    // Use the selected language id for translations
    this._translateService.use(language);

    this._coreConfigService.setConfig(
      { app: { appLanguage: language } },
      { emitEvent: true }
    );

    if (this._authService.currentUserValue != null) {
      this._authService
        .updateUserLanguage(language)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (data: any) => {
            this._toastrService.success(
              data.message + ' Page will reload in 1.5 seconds',
              'Success!',
              { toastClass: 'toast ngx-toastr', closeButton: true }
            );
            setTimeout(() => {
              // reload the page
              window.location.reload();
            }, 2000);
          },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
              confirmButtonText: this._translateService.instant('OK'),
              confirmButtonColor: '#ed1c24',
            });
          }
        );
    }
  }

  /**
   * Toggle Dark Skin
   */
  toggleDarkSkin() {
    // Get the current skin
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.currentSkin = config.layout.skin;
      });

    // Toggle Dark skin with prevSkin skin
    this.prevSkin = localStorage.getItem('prevSkin');

    if (this.currentSkin === 'dark') {
      this._coreConfigService.setConfig(
        { layout: { skin: this.prevSkin ? this.prevSkin : 'default' } },
        { emitEvent: true }
      );
    } else {
      localStorage.setItem('prevSkin', this.currentSkin);
      this._coreConfigService.setConfig(
        { layout: { skin: 'dark' } },
        { emitEvent: true }
      );
    }
  }

  resetData() {
    // are you sure
    Swal.fire({
      title: this._translateService.instant('Are you sure?'),
      html: `<p class="text-center">` + this._translateService.instant('This will reset all your data and you will be logged out') + `</p>
      <p class="text-center">
      `+ this._translateService.instant('This action cannot be undone') + `</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this._translateService.instant('Yes'),
      cancelButtonText: this._translateService.instant('No'),
      confirmButtonColor: '#ed1c24',
      cancelButtonColor: '#999999',
    }).then((result) => {
      if (result.isConfirmed) {
        this._loadingService.show();
        this._userService.resetData().subscribe((data: any) => {
          this._toastrService.success(data.message, 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          });

          this._authService.logoutNotRequest();
        });
      }
    });
  }

  /**
   * Logout method
   */
  logout() {
    this._authService.logout();
    //  this._router.navigate(["/auth/login"]);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */

  currentFeature: string = '';
  ngOnInit(): void {
    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('EZLEAGUE_USER'));
    console.log('currentUser', this.currentUser);

    // getcurrent urrl
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('router', this._router.url);
        ///registration/select-event
        // get first part of url
        let url = this._router.url.split('/')[1];
        this.currentFeature = url;
      }
    });

    // Subscribe to the config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
        this.horizontalMenu = config.layout.type === 'horizontal';
        this.hiddenMenu = config.layout.menu.hidden === true;
        this.currentSkin = config.layout.skin;

        // Fix: for vertical layout if default navbar fixed-top than set isFixed = true
        if (this.coreConfig.layout.type === 'vertical') {
          setTimeout(() => {
            if (this.coreConfig.layout.navbar.type === 'fixed-top') {
              this.isFixed = true;
            }
          }, 0);
        }
      });

    // Horizontal Layout Only: Add class fixed-top to navbar below large screen
    if (this.coreConfig.layout.type == 'horizontal') {
      // On every media(screen) change
      this._coreMediaService.onMediaUpdate
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          const isFixedTop = this._mediaObserver.isActive('bs-gt-xl');
          if (isFixedTop) {
            this.isFixed = false;
          } else {
            this.isFixed = true;
          }
        });
    }

    // Set the selected language from default languageOptions
    this.selectedLanguage = _.find(this.languageOptions, {
      id: this._translateService.currentLang,
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onClickLogin() {
    this._authService.logout();
  }
}
