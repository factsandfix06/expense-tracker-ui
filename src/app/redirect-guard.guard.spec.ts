import { TestBed } from '@angular/core/testing';

import { RedirectGuard } from './redirect-guard.guard';

describe('RedirectGuardGuard', () => {
  let guard: RedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
