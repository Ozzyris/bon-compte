import { TestBed, inject } from '@angular/core/testing';

import { ConvertorService } from './convertor.service';

describe('ConvertorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvertorService]
    });
  });

  it('should be created', inject([ConvertorService], (service: ConvertorService) => {
    expect(service).toBeTruthy();
  }));
});
