import { TestBed } from '@angular/core/testing';

import { SendMessagesService } from './send-messages.service';

describe('SendMessagesService', () => {
  let service: SendMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
