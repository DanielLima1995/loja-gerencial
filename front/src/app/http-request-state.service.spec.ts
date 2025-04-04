import { TestBed } from '@angular/core/testing';

import { HttpRequestStateService } from './http-request-state.service';

describe('HttpRequestStateService', () => {
  let service: HttpRequestStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRequestStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
