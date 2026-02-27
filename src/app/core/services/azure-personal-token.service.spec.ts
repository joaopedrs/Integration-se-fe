import { TestBed } from '@angular/core/testing';

import { AzurePersonalTokenService } from './azure-personal-token.service';

describe('AzurePersonalTokenService', () => {
  let service: AzurePersonalTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzurePersonalTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
