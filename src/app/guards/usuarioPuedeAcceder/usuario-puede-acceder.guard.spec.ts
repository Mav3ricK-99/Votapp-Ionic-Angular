import { TestBed } from '@angular/core/testing';

import { UsuarioPuedeAccederGuard } from './usuario-puede-acceder.guard';

describe('UsuarioPuedeAccederGuard', () => {
  let guard: UsuarioPuedeAccederGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UsuarioPuedeAccederGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
