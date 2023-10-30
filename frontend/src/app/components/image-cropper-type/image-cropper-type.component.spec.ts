import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperTypeComponent } from './image-cropper-type.component';

describe('ImageCropperTypeComponent', () => {
  let component: ImageCropperTypeComponent;
  let fixture: ComponentFixture<ImageCropperTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCropperTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCropperTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
