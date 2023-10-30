import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ckeditor5TypeComponent } from './ckeditor5-type.component';

describe('Ckeditor5TypeComponent', () => {
  let component: Ckeditor5TypeComponent;
  let fixture: ComponentFixture<Ckeditor5TypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ckeditor5TypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ckeditor5TypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
