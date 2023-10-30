import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsheetTemplateComponent } from './teamsheet-template.component';

describe('TeamsheetTemplateComponent', () => {
  let component: TeamsheetTemplateComponent;
  let fixture: ComponentFixture<TeamsheetTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsheetTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsheetTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
