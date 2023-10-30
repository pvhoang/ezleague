import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageTablesComponent } from './stage-tables.component';

describe('StageTablesComponent', () => {
  let component: StageTablesComponent;
  let fixture: ComponentFixture<StageTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageTablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StageTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
