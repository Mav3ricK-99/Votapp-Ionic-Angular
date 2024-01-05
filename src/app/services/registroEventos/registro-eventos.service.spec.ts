import { TestBed } from '@angular/core/testing';

import { RegistroEventosService } from './registro-eventos.service';

describe('RegistroEventosService', () => {
  let service: RegistroEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
