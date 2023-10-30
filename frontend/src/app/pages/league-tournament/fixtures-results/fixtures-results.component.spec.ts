import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturesResultsComponent } from './fixtures-results.component';

describe('FixturesResultsComponent', () => {
  let component: FixturesResultsComponent;
  let fixture: ComponentFixture<FixturesResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixturesResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixturesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
