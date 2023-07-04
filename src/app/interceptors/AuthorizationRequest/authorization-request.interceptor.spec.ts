import { TestBed } from '@angular/core/testing';

import { AuthorizationRequestInterceptor } from './authorization-request.interceptor';

describe('AuthorizationRequestInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthorizationRequestInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthorizationRequestInterceptor = TestBed.inject(AuthorizationRequestInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
