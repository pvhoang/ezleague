import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPlayersComponent } from './assign-players.component';

describe('TeamPlayersComponent', () => {
  let component: TeamPlayersComponent;
  let fixture: ComponentFixture<TeamPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamPlayersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
