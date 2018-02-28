import { TestBed, inject } from '@angular/core/testing';

import { ShortenerService } from './shortener.service';

describe('ShortenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShortenerService]
    });
  });

  it('should be created', inject([ShortenerService], (service: ShortenerService) => {
    expect(service).toBeTruthy();
  }));
});
