import { TestBed, inject } from '@angular/core/testing';

import { ArchiveService } from './archive.service';

describe('ArchiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArchiveService]
    });
  });

  it('should ...', inject([ArchiveService], (service: ArchiveService) => {
    expect(service).toBeTruthy();
  }));
});
