import { TestBed } from '@angular/core/testing';

import { TeamsheetService } from './teamsheet.service';

describe('TeamsheetService', () => {
  let service: TeamsheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamsheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
