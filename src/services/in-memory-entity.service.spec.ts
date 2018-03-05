import { TestBed, inject } from '@angular/core/testing';

import { InMemoryEntityService } from './in-memory-entity.service';

describe('InMemoryEntityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemoryEntityService]
    });
  });

  it('should be created', inject([InMemoryEntityService], (service: InMemoryEntityService) => {
    expect(service).toBeTruthy();
  }));
});
