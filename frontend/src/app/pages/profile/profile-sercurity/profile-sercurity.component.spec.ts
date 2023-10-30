import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSercurityComponent } from './profile-sercurity.component';

describe('ProfileSercurityComponent', () => {
  let component: ProfileSercurityComponent;
  let fixture: ComponentFixture<ProfileSercurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileSercurityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSercurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
