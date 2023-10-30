import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueReportsComponent } from './league-reports.component';

describe('LeagueReportsComponent', () => {
  let component: LeagueReportsComponent;
  let fixture: ComponentFixture<LeagueReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeagueReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagueReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
