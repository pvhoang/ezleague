import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuitableGroupComponent } from './modal-suitable-group.component';

describe('ModalSuitableGroupComponent', () => {
  let component: ModalSuitableGroupComponent;
  let fixture: ComponentFixture<ModalSuitableGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSuitableGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSuitableGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
