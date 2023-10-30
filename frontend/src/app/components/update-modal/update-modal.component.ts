import { Component, OnInit } from '@angular/core';
import { UpdateService } from 'app/services/update.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.scss'],
})
export class UpdateModalComponent implements OnInit {
  currentVersion: string = '';
  availableVersion: string = '';
  constructor(public _updateService: UpdateService) {}

  ngOnInit(): void {}
  openAppStore() {
    this._updateService.openAppStore();
  }
}
