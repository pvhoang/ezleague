import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageTeamsComponent } from './stage-teams.component';

describe('StageTeamsComponent', () => {
  let component: StageTeamsComponent;
  let fixture: ComponentFixture<StageTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StageTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
