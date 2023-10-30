import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as Waves from 'node-waves';
import { App } from '@capacitor/app';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { Location } from '@angular/common';
import { menu } from 'app/menu/menu';
import { AuthService } from './services/auth.service';

import { Router } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { FcmService } from './services/fcm.service';
import { NotificationsService } from './layout/components/navbar/navbar-notification/notifications.service';
import { SettingsService } from './services/settings.service';
import { Capacitor } from '@capacitor/core';
import { UpdateService } from './services/update.service';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  coreConfig: any;
  menu: any;
  defaultLanguage: 'en'; // This language will be used as a fallback when a translation isn't found in the current language
  appLanguage: 'zh_HK'; // Set application default language i.e fr

  // Private
  private _unsubscribeAll: Subject<any>;

  //Get element by angular view child
  @ViewChild('modal_loading_screen', { static: true })
  modal_loading_screen: ElementRef;

  /**
   * Constructor
   *
   * @param {DOCUMENT} document
   * @param {Title} _title
   * @param {Renderer2} _renderer
   * @param {ElementRef} _elementRef
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CoreLoadingScreenService} _coreLoadingScreenService
   * @param {CoreMenuService} _coreMenuService
   * @param {CoreTranslationService} _coreTranslationService
   * @param {TranslateService} _translateService
   */
  constructor(
    @Inject(DOCUMENT) private document: any,
    private _title: Title,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    public _coreConfigService: CoreConfigService,
    private _coreSidebarService: CoreSidebarService,
    private _coreMenuService: CoreMenuService,
    private _translateService: TranslateService,
    private _authService: AuthService,
    private _router: Router,
    private _coreLoadingScreenService: CoreLoadingScreenService,
    public _loadingService: LoadingService,
    public _fcmService: FcmService,
    public _notificationService: NotificationsService,
    public _settingsService: SettingsService,
    private location: Location,
    public _updateService: UpdateService,
    public _navigationService: NavigationService
  ) {
    // Get the application main menu
    this.menu = JSON.parse(JSON.stringify(menu));

    // Register the menu to the menu service
    this._coreMenuService.register('main', this.menu);

    // Set the main menu as our current menu
    this._coreMenuService.setCurrentMenu('main');

    // Add languages to the translation service
    this._translateService.addLangs(['en', 'zh_HK']);

    // This language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang('en');

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    if (_authService.currentUserValue) {
      _settingsService.getInitSettings(false);
    }
    _updateService.checkLiveUpdate();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._fcmService.initPush();
    this._fcmService.requestPermission();
    // this._fcmService.listen();
    this._notificationService.listen();
    this._updateService.addUpdateFailedEvent();
    // This code handles the functionality of the back button
    App.addListener('backButton', ({ canGoBack }) => {
      console.log('canGoBack', canGoBack);

      // Check if there is anything in the browsing history
      if (!canGoBack) {
        // Exit the app if not
        App.exitApp();
      } else {
        this._navigationService.back();
      }
    });

    // Init wave effect (Ripple effect)
    Waves.init();
    this._loadingService.modalLoading = this.modal_loading_screen;
    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
        const appLanguage = this.coreConfig.app.appLanguage || 'en';
        this._translateService.use(appLanguage);

        setTimeout(() => {
          this._translateService.setDefaultLang('en');
          this._translateService.setDefaultLang(appLanguage);
        });

        // Remove default classes first
        this._elementRef.nativeElement.classList.remove(
          'vertical-layout',
          'vertical-menu-modern',
          'horizontal-layout',
          'horizontal-menu'
        );
        // Add class based on config options
        if (this.coreConfig.layout.type === 'vertical') {
          this._elementRef.nativeElement.classList.add(
            'vertical-layout',
            'vertical-menu-modern'
          );
        } else if (this.coreConfig.layout.type === 'horizontal') {
          this._elementRef.nativeElement.classList.add(
            'horizontal-layout',
            'horizontal-menu'
          );
        }

        // Navbar
        //--------

        // Remove default classes first
        this._elementRef.nativeElement.classList.remove(
          'navbar-floating',
          'navbar-static',
          'navbar-sticky',
          'navbar-hidden'
        );

        // Add class based on config options
        if (this.coreConfig.layout.navbar.type === 'navbar-static-top') {
          this._elementRef.nativeElement.classList.add('navbar-static');
        } else if (this.coreConfig.layout.navbar.type === 'fixed-top') {
          this._elementRef.nativeElement.classList.add('navbar-sticky');
        } else if (this.coreConfig.layout.navbar.type === 'floating-nav') {
          this._elementRef.nativeElement.classList.add('navbar-floating');
        } else {
          this._elementRef.nativeElement.classList.add('navbar-hidden');
        }

        // Footer
        //--------

        // Remove default classes first
        this._elementRef.nativeElement.classList.remove(
          'footer-fixed',
          'footer-static',
          'footer-hidden'
        );

        // Add class based on config options
        if (this.coreConfig.layout.footer.type === 'footer-sticky') {
          this._elementRef.nativeElement.classList.add('footer-fixed');
        } else if (this.coreConfig.layout.footer.type === 'footer-static') {
          this._elementRef.nativeElement.classList.add('footer-static');
        } else {
          this._elementRef.nativeElement.classList.add('footer-hidden');
        }

        // Blank layout
        if (
          this.coreConfig.layout.menu.hidden &&
          this.coreConfig.layout.navbar.hidden &&
          this.coreConfig.layout.footer.hidden
        ) {
          this._elementRef.nativeElement.classList.add('blank-page');
          // ! Fix: Transition issue while coming from blank page
          this._renderer.setAttribute(
            this._elementRef.nativeElement.getElementsByClassName(
              'app-content'
            )[0],
            'style',
            'transition:none'
          );
        } else {
          this._elementRef.nativeElement.classList.remove('blank-page');
          // ! Fix: Transition issue while coming from blank page
          setTimeout(() => {
            this._renderer.setAttribute(
              this._elementRef.nativeElement.getElementsByClassName(
                'app-content'
              )[0],
              'style',
              'transition:300ms ease all'
            );
          }, 100);
          // If navbar hidden
          if (this.coreConfig.layout.navbar.hidden) {
            this._elementRef.nativeElement.classList.add('navbar-hidden');
          }
          // Menu (Vertical menu hidden)
          if (this.coreConfig.layout.menu.hidden) {
            this._renderer.setAttribute(
              this._elementRef.nativeElement,
              'data-col',
              '1-column'
            );
          } else {
            this._renderer.removeAttribute(
              this._elementRef.nativeElement,
              'data-col'
            );
          }
          // Footer
          if (this.coreConfig.layout.footer.hidden) {
            this._elementRef.nativeElement.classList.add('footer-hidden');
          }
        }

        // Skin Class (Adding to body as it requires highest priority)
        if (
          this.coreConfig.layout.skin !== '' &&
          this.coreConfig.layout.skin !== undefined
        ) {
          this.document.body.classList.remove(
            'default-layout',
            'bordered-layout',
            'dark-layout',
            'semi-dark-layout'
          );
          this.document.body.classList.add(
            this.coreConfig.layout.skin + '-layout'
          );
        }
      });

    // Set the application page title
    this._title.setTitle(this.coreConfig.app.appTitle);

    // create trigger when updating user
    this._authService.currentUser.subscribe((stage: any) => {
      if (stage != null) {
        this._coreConfigService.setConfig(
          { app: { appLanguage: stage.language } },
          { emitEvent: true }
        );
        this._translateService.use(stage.language);
        // this._router.navigate(["/home"]);
      }
    });

    this._updateService.checkRequiredVersion();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebar(key): void {
    this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }
}
