import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTwofaComponent } from './verify-twofa.component';

describe('VerifyTwofaComponent', () => {
  let component: VerifyTwofaComponent;
  let fixture: ComponentFixture<VerifyTwofaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyTwofaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyTwofaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
