import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTeamsheetHistoryComponent } from './modal-teamsheet-history.component';

describe('ModalTeamsheetHistoryComponent', () => {
  let component: ModalTeamsheetHistoryComponent;
  let fixture: ComponentFixture<ModalTeamsheetHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTeamsheetHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTeamsheetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
