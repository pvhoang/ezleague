import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModuleComponent } from './translate-module.component';

describe('TranslateModuleComponent', () => {
  let component: TranslateModuleComponent;
  let fixture: ComponentFixture<TranslateModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslateModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslateModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
