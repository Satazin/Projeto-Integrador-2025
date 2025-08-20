import { TestBed } from '@angular/core/testing';

import { RealtimeDatabaseService } from './realtime-databse';

describe('RealtimeDatabaseService', () => {
  let service: RealtimeDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimeDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
