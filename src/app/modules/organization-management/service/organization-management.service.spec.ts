import { TestBed } from '@angular/core/testing';

import { OrganizationManagementService } from './organization-management.service';

describe('OrganizationManagementService', () => {
  let service: OrganizationManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
