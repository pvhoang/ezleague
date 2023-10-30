import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFollowsComponent } from './modal-follows.component';

describe('ModalFollowsComponent', () => {
  let component: ModalFollowsComponent;
  let fixture: ComponentFixture<ModalFollowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFollowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFollowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
