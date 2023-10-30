import { TestBed } from '@angular/core/testing';

import { WowzaService } from './wowza.service';

describe('WWowzaService', () => {
  let service: WowzaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WowzaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
