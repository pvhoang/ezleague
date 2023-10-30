import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchRoomComponent } from './watch-room.component';

describe('WatchRoomComponent', () => {
  let component: WatchRoomComponent;
  let fixture: ComponentFixture<WatchRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
