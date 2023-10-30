import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesDetailsComponent } from './matches-details.component';

describe('MatchesDetailsComponent', () => {
  let component: MatchesDetailsComponent;
  let fixture: ComponentFixture<MatchesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
