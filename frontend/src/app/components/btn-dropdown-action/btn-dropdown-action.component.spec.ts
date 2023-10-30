import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnDropdownActionComponent } from './btn-dropdown-action.component';

describe('BtnDropdownActionComponent', () => {
  let component: BtnDropdownActionComponent;
  let fixture: ComponentFixture<BtnDropdownActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnDropdownActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnDropdownActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
