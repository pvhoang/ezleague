import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { CoreConfigService } from '@core/services/config.service';
import { UpdateService } from 'app/services/update.service';

@Component({
  selector: 'app-content-background',
  templateUrl: './content-background.component.html',
  styleUrls: ['./content-background.component.scss'],
})
export class ContentBackgroundComponent implements OnInit {
  public coreConfig: any;
  appVersion: string;
  constructor(
    public _coreConfigService: CoreConfigService,
    public _updateService: UpdateService
  ) {
    this._coreConfigService.config.subscribe((config) => {
      this.coreConfig = config;
    });

    _updateService.getCurrentVersion().then((version) => {
      this.appVersion = version;
    });
  }

  ngOnInit(): void {}
}
