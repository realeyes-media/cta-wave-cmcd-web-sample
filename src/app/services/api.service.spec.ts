import { HttpClientTestingModule, HttpTestingController  } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HlsSamples } from '../interfaces/HLS-sample-datatype';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const testData: HlsSamples = {
    "name": "Big Buck Bunny",
    "src": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  };

  const testUrl = '/assets/HLS-samples-data.json';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
  });

  it('ApiService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a get request to fetch list of streams', () => {
    const testDataArray = [testData];

    service.fetchSampleData().subscribe(data => {
      expect(data).toEqual(testDataArray)
    });

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(testDataArray);

    httpTestingController.verify();
  });

  it('can test HttpClient.get', () => {

    httpClient.get<HlsSamples>(testUrl)
      .subscribe(data =>
        expect(data).toEqual(testData)
      );

    // expect a request
    const req = httpTestingController.expectOne(testUrl);

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, resolve Observable
    req.flush(testData);

    // assert that there are no outstanding requests.
    httpTestingController.verify();
  });
});
