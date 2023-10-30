import { TestBed } from '@angular/core/testing';

import { SelectPlayerGuard } from './select-player.guard';

describe('SelectPlayerGuard', () => {
  let guard: SelectPlayerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SelectPlayerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
