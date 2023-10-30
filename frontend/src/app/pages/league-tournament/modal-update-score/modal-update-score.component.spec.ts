import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateScoreComponent } from './modal-update-score.component';

describe('ModalUpdateScoreComponent', () => {
  let component: ModalUpdateScoreComponent;
  let fixture: ComponentFixture<ModalUpdateScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUpdateScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUpdateScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
