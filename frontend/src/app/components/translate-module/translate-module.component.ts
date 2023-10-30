import { CoreConfigService } from '@core/services/config.service';
import { Subject } from "rxjs";
import { AuthService } from "app/services/auth.service";
import { AppConfig } from "./../../app-config";
import { TranslateService } from "@ngx-translate/core";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-translate-module",
  templateUrl: "./translate-module.component.html",
  styleUrls: ["./translate-module.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TranslateModuleComponent implements OnInit {
  currrentLanguage = AppConfig.LANGUAGES.find(
    (x) => x.code === this._translateService.currentLang
  );
  languages = AppConfig.LANGUAGES;
  languageSelected = this.currrentLanguage;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private modalService: NgbModal,
    private _translateService: TranslateService,
    private _authService: AuthService,
    private _coreConfigService: CoreConfigService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {}

  modalOpen(modalBasic) {
    this.modalService.open(modalBasic, {
      windowClass: "modal",
      centered: true,
      size: "sm",
      beforeDismiss: () => {
        this.languageSelected = this.currrentLanguage;
        return true;
      },
    });
  }

  changeLanguage(lang: any) {
    this.languageSelected = lang;
  }

  async saveLanguage() {
    this._translateService.use(this.languageSelected.code);
    
    this.currrentLanguage = this.languageSelected;
    let current_config;
    await this._coreConfigService.config.subscribe((config) => {
      current_config = config;
    });
    current_config.app.appLanguage = this.languageSelected.code;
    current_config.layout.enableLocalStorage = true;
    this._coreConfigService.setConfig(current_config,{emitEvent: true});
    current_config.layout.enableLocalStorage = false;
    this._coreConfigService.setConfig(current_config);
    this.modalService.dismissAll();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  dismissModal()
  {
    this.languageSelected = this.currrentLanguage;
    this.modalService.dismissAll();
  }
}
