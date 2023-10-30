import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectClubModuleComponent } from './select-club-module.component';

describe('SelectClubModuleComponent', () => {
  let component: SelectClubModuleComponent;
  let fixture: ComponentFixture<SelectClubModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectClubModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectClubModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
