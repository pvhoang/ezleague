import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNewPlayerComponent } from './register-new-player.component';

describe('RegisterNewPlayerComponent', () => {
  let component: RegisterNewPlayerComponent;
  let fixture: ComponentFixture<RegisterNewPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterNewPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterNewPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
