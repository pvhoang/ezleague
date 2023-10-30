import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentBackgroundComponent } from './content-background.component';

describe('ContentBackgroundComponent', () => {
  let component: ContentBackgroundComponent;
  let fixture: ComponentFixture<ContentBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentBackgroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
