import { TestBed } from '@angular/core/testing';

import { Commentaire } from './commentaire';

describe('Commentaire', () => {
  let service: Commentaire;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Commentaire);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
