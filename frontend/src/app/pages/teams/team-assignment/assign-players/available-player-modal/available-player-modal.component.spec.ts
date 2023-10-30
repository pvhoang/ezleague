import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailablePlayerModalComponent } from './available-player-modal.component';

describe('AvailablePlayerModalComponent', () => {
  let component: AvailablePlayerModalComponent;
  let fixture: ComponentFixture<AvailablePlayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailablePlayerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailablePlayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
