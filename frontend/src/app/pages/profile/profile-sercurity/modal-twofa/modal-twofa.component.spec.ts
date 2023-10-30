import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTwofaComponent } from './modal-twofa.component';

describe('ModalTwofaComponent', () => {
  let component: ModalTwofaComponent;
  let fixture: ComponentFixture<ModalTwofaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTwofaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTwofaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
