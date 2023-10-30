import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-suitable-group',
  templateUrl: './modal-suitable-group.component.html',
  styleUrls: ['./modal-suitable-group.component.scss']
})
export class ModalSuitableGroupComponent implements OnInit {

  groups: any[] ;
  constructor(
    private _modalActive: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  onClose(){
    console.log('close');
    this._modalActive.close();
  }

}
