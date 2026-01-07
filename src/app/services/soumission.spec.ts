import { TestBed } from '@angular/core/testing';

import { Soumission } from './soumission';

describe('Soumission', () => {
  let service: Soumission;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Soumission);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
