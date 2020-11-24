import { TestBed } from '@angular/core/testing';

import { ElementDataService } from './element-data.service';

describe('ElementDataService', () => {
  let service: ElementDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
