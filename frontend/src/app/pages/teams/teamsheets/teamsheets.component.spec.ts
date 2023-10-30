import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSheetsComponent } from './teamsheets.component';

describe('TeamSheetsComponent', () => {
  let component: TeamSheetsComponent;
  let fixture: ComponentFixture<TeamSheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamSheetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
