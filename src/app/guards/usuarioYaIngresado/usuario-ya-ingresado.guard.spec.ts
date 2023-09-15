import { TestBed } from '@angular/core/testing';

import { UsuarioYaIngresadoGuard } from './usuario-ya-ingresado.guard';

describe('UsuarioYaIngresadoGuard', () => {
  let guard: UsuarioYaIngresadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UsuarioYaIngresadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
