import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignNewCoachComponent } from './assign-new-coach.component';

describe('AssignNewCoachComponent', () => {
  let component: AssignNewCoachComponent;
  let fixture: ComponentFixture<AssignNewCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignNewCoachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignNewCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
