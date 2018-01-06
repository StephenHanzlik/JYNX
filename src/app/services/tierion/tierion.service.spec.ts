import { TestBed, inject } from '@angular/core/testing';

import { TierionService } from './tierion.service';

describe('TierionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TierionService]
    });
  });

  it('should be created', inject([TierionService], (service: TierionService) => {
    expect(service).toBeTruthy();
  }));
});
