import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { App } from '@capacitor/app';
import { map } from 'rxjs/operators';

import {
  AppUpdate,
  AppUpdateAvailability,
} from '@capawesome/capacitor-app-update';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateModalComponent } from 'app/components/update-modal/update-modal.component';
import { environment } from 'environments/environment';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';
import packageJson from '../../../package.json';
import { SettingsService } from './settings.service';
@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(
    public _modalService: NgbModal,
    public _http: HttpClient,
    public _settingsService: SettingsService,
    public ngZone: NgZone
  ) {}
  public downloadProgress = new EventEmitter<any>();
  public downloadComplete = new EventEmitter<any>();
  public downloadFailed = new EventEmitter<any>();
  public updateFailed = new EventEmitter<any>();
  currentVersion: string;
  currentVersionCode: number;
  currentVersionBundle: string;
  getCurrentAppVersion = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    return result.currentVersion;
  };

  getAvailableAppVersion = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    return result.availableVersion;
  };

  openModalUpdate(currentVersion, availableVersion) {
    let modalRef = this._modalService.open(UpdateModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.currentVersion = currentVersion;
    modalRef.componentInstance.availableVersion = availableVersion;
    return modalRef;
  }

  openAppStore = async () => {
    console.log('openAppStore');

    await AppUpdate.openAppStore();
  };

  performImmediateUpdate = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
      return;
    }
    if (result.immediateUpdateAllowed) {
      await AppUpdate.performImmediateUpdate();
    }
  };

  startFlexibleUpdate = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
      return;
    }
    if (result.flexibleUpdateAllowed) {
      await AppUpdate.startFlexibleUpdate();
    }
  };

  completeFlexibleUpdate = async () => {
    await AppUpdate.completeFlexibleUpdate();
  };

  getUpdateForVersion(version) {
    this.checkRequiredVersion();
    // let version = (await App.getInfo()).version;
    return this._http
      .get<any>(`${environment.apiUrl}/releases/towards_version/${version}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  async updateVersion(version, url) {
    console.log('updateVersion', version, url);

    if (Capacitor.isNativePlatform()) {
      let current_version = await this.getCurrentVersion();
      if (current_version < version) {
        CapacitorUpdater.addListener('download', (info) => {
          this.ngZone.run(() => {
            this.downloadProgress.emit(info);
          });
        });

        CapacitorUpdater.addListener('downloadComplete', (info) => {
          this.downloadComplete.emit(info);
        });

        CapacitorUpdater.addListener('downloadFailed', (info) => {
          this.downloadFailed.emit(info);
          // CapacitorUpdater.removeAllListeners();
        });

        let new_version = await CapacitorUpdater.download({
          url: url,
          version: version,
        });
        console.log('new_version', new_version);
        await CapacitorUpdater.set(new_version);
      }
    } else {
      console.log('updateVersion', version, url);
    }
  }

  addUpdateFailedEvent() {
    CapacitorUpdater.addListener('updateFailed', (info) => {
      console.log('updateFailed', info);
      this.updateFailed.emit(info);
    });
  }

  getLatest = async () => {
    const result = await CapacitorUpdater.getLatest();
    console.log('getLatest', result);
    return result;
  };

  getCurrentBundle = async () => {
    const result = await CapacitorUpdater.current();
    if (result && result.bundle) {
      this.currentVersionBundle = result.bundle.version;
    }
    return result.bundle;
  };

  getCurrentVersion = async () => {
    let current_version = '';
    if (Capacitor.isNativePlatform()) {
      const result = await CapacitorUpdater.current();
      if (result) {
        current_version =
          result.bundle.version == 'builtin'
            ? result.native
            : result.bundle.version;

        if (
          result.bundle.version != 'builtin' &&
          result.native >= result.bundle.version
        ) {
          current_version = result.native;
          // delete bundle
          await CapacitorUpdater.delete(result.bundle);
          // reset bundle version to native version
          await CapacitorUpdater.reset();
        }
      }
    } else {
      current_version = packageJson.version;
    }
    this.currentVersion = current_version;
    return current_version;
  };

  listBundle = async () => {
    const result = await CapacitorUpdater.list();
    console.log('listBundle', result);
    return result;
  };

  checkLiveUpdate() {
    if (!Capacitor.isNativePlatform()) return;
    this.getCurrentVersion().then((current_version) => {
      this.getUpdateForVersion(current_version).subscribe((data) => {
        if (data.length > 0) {
          this.updateVersion(data[0].version, data[0].download_link);
        }
      });
    });
  }

  checkRequiredVersion() {
    this._settingsService.getRequiredVersion().subscribe((version) => {
      console.log(version);
      if (Capacitor.isNativePlatform()) {
        App.getInfo().then((info) => {
          switch (Capacitor.getPlatform()) {
            case 'android':
              if (version.a_version > info.version) {
                this.openModalUpdate(info.version, version.a_version);
                console.log('update');
              }
              break;
            case 'ios':
              if (version.i_version > info.version) {
                this.openModalUpdate(info.version, version.i_version);
                console.log('update');
              }
              break;
          }
        });
      }
    });
  }
}
