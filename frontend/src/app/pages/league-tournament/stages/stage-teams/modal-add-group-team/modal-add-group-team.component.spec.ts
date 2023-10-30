import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddGroupTeamComponent } from './modal-add-group-team.component';

describe('ModalAddGroupTeamComponent', () => {
  let component: ModalAddGroupTeamComponent;
  let fixture: ComponentFixture<ModalAddGroupTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddGroupTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddGroupTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
