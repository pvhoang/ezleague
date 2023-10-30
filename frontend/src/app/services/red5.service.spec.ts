import { TestBed } from '@angular/core/testing';

import { Red5Service } from './red5.service';

describe('Red5Service', () => {
  let service: Red5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Red5Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
