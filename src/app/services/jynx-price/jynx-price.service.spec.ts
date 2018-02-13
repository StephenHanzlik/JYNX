import { TestBed, inject } from '@angular/core/testing';

import { JynxPriceService } from './jynx-price.service';

describe('JynxPriceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JynxPriceService]
    });
  });

  it('should be created', inject([JynxPriceService], (service: JynxPriceService) => {
    expect(service).toBeTruthy();
  }));
});
