import { TestBed } from '@angular/core/testing';

import { TutorialTourService } from './tutorial-tour.service';

describe('TutorialTourService', () => {
  let service: TutorialTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorialTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
