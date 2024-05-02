import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { headGuard } from './head.guard';

describe('headGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => headGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
