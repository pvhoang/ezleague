import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public buttonLoading: boolean = false;
  public modalLoading: any;
  public modalRef: any;
  constructor(public modalService: NgbModal) {}
  public is_loading: boolean = false;
  public show() {
    // console.log("open", this.modalLoading);
    if (!this.is_loading) {
      this.modalRef = this.modalService.open(this.modalLoading, {
        centered: true,
        backdrop: 'static',
        size: 'xxs',
      });
      this.is_loading = true;
    }
  }

  public dismiss() {
    // console.log("close", this.modalLoading);
    if (this.modalRef && this.is_loading == true) this.modalRef.close();
    this.is_loading = false;
  }

  public shơwButtonLoading() {
    this.buttonLoading = true;
  }

  public dismissButtonLoading() {
    this.buttonLoading = false;
  }
}
