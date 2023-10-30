import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMatchDetailsComponent } from './update-match-details.component';

describe('UpdateMatchDetailsComponent', () => {
  let component: UpdateMatchDetailsComponent;
  let fixture: ComponentFixture<UpdateMatchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMatchDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
