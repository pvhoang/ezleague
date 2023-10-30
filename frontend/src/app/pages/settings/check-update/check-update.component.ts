import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'app/services/loading.service';
import { UpdateService } from 'app/services/update.service';
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-update',
  templateUrl: './check-update.component.html',
  styleUrls: ['./check-update.component.scss'],
})
export class CheckUpdateComponent implements OnInit {
  constructor(
    public _updateService: UpdateService,
    public _loadingService: LoadingService,
    public _translateService: TranslateService
  ) {}
  current_version = '';
  updated_at = '';
  message_check_update = '';
  available_versions = [];
  download_progress = 0;
  isNativePlatform = Capacitor.isNativePlatform();
  Unsubscribe = [];
  ngOnInit(): void {
    this._updateService.getCurrentVersion().then((version) => {
      this.current_version = version;
      this.checkUpdateVersion();
      this.getCurrentBundle();
    });
  }
  async getCurrentBundle() {
    let bundle = await this._updateService.getCurrentBundle();

    if (bundle && bundle.id != 'builtin')
      this.updated_at = moment(bundle.downloaded).format('MMM DD, YYYY HH:mm');
  }
  checkUpdateVersion() {
    let lastest: boolean = false;
    this._loadingService.shơwButtonLoading();
    if (this.current_version) {
      this._updateService
        .getUpdateForVersion(this.current_version)
        .subscribe((data: any[]) => {
          console.log(data);
          if (data.length > 0) {
            let version = data[0].version;
            let name = data[0].name;
            if (version <= this.current_version) {
              lastest = true;
            } else if (version > this.current_version) {
              this.available_versions = data;
              if (Capacitor.isNativePlatform()) {
                this.message_check_update = this._translateService.instant(
                  'New version is available. Please update to version <span class="badge badge-success">new version</span>',
                  { name: name }
                );
              } else {
                this.message_check_update = this._translateService.instant(
                  'New version is available. Please press keystroke <code>Ctrl+Shift+R</code> or <code><i class="fa-solid fa-command"></i> Cmd+Shift+R</code> to update to version <span class="badge badge-success">new version</span>',
                  { name: name }
                );
              }
            }
          } else {
            lastest = true;
          }
          if (lastest) {
            this.message_check_update = 'You are using the latest version';
          }
          this._updateService.listBundle();
        });
    }
  }

  updateVersion() {
    if (this.available_versions.length > 0) {
      this.Unsubscribe.push(
        this._updateService.downloadProgress.subscribe((info) => {
          console.log(info);

          if (info.hasOwnProperty('percent')) {
            this.download_progress = info.percent;
          }
        })
      );

      this.Unsubscribe.push(
        this._updateService.downloadFailed.subscribe((info) => {
          this.download_progress = 0;
          Swal.fire({
            icon: 'error',
            title: this._translateService.instant('Download failed'),
          });
        })
      );
      this._updateService.updateVersion(
        this.available_versions[0].version,
        this.available_versions[0].download_link
      );
    }
  }

  async reset() {
    await CapacitorUpdater.reset();
  }

  ngOnDestroy() {
    this.Unsubscribe.forEach((element) => {
      element.unsubscribe();
    });
  }
}
