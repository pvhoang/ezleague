import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCoachesComponent } from './assign-coaches.component';

describe('TeamCoachesComponent', () => {
  let component: TeamCoachesComponent;
  let fixture: ComponentFixture<TeamCoachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamCoachesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamCoachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
