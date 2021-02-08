import { TestBed } from '@angular/core/testing';

import { LoaderAndNotificationService } from './notification.service';

describe('LoaderAndNotificationService', () => {
  let service: LoaderAndNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderAndNotificationService);
  });

  it('LoaderAndNotificationService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('default state of loader should be false', (done: DoneFn) => {
    service.loader.subscribe(data => {
      expect(data).toBeFalse();
      done();
    });
  });

  it('loader should change state to true', (done: DoneFn) => {
    service.showLoader();
    service.loader.subscribe(data => {
      expect(data).toBeTrue();
      done();
    });
  });

  it('loader should change state to false', (done: DoneFn) => {
    service.hideLoader();
    service.loader.subscribe(data => {
      expect(data).toBeFalse();
      done();
    });
  });

});
