import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUpdateComponent } from './check-update.component';

describe('CheckUpdateComponent', () => {
  let component: CheckUpdateComponent;
  let fixture: ComponentFixture<CheckUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
