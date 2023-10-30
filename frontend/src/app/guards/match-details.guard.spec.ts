import { TestBed } from '@angular/core/testing';

import { MatchDetailsGuard } from './match-details.guard';

describe('MatchDetailsGuard', () => {
  let guard: MatchDetailsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MatchDetailsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
