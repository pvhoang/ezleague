import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatimepickerComponent } from './datatimepicker.component';

describe('DatatimepickerComponent', () => {
  let component: DatatimepickerComponent;
  let fixture: ComponentFixture<DatatimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatimepickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatatimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
