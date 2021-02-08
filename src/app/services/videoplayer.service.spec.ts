import { TestBed } from '@angular/core/testing';

import { VideoPlayerService } from './videoplayer.service';
import { HlsSamples } from '../interfaces/HLS-sample-datatype';

const testData: HlsSamples = {
  "name": "Big Buck Bunny",
  "src": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
};

describe('VideoPlayerService', () => {
  let service: VideoPlayerService;

  const testArrayData = [testData];
  const newStream = {name: 'test data', src: 'the_url'};
  const testArrayWithMoreData = [...testArrayData, newStream];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoPlayerService);
  });

  it('VideoPlayerService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('default state of stream should be toBeFalsy', (done: DoneFn) => {
    service.stream.subscribe(data => {
      expect(data).toBeFalsy();
      done();
    });
  });

  it('should set stream data', (done: DoneFn) => {
    service.setStream(testData);
    service.stream.subscribe(data => {
      expect(data).toEqual(testData);
      done();
    });
  });

  describe('isNextStreamAvaliable: check if next stream is avaliable', () => {
    it('default state should be false', () => {

      // default state
      expect(service.isNextStreamAvaliable(null)).toBeFalse();
    });

    it('should be false with no stream list provided', () => {
      expect(service.isNextStreamAvaliable(testData)).toBeFalse();
    });

    it('should be false with only one data in stream list', () => {
      service.setStreamList(testArrayData);
      expect(service.isNextStreamAvaliable(testData)).toBeFalse();
    });

    it('should be true when checking with data not last in the list  and false with last data', () => {
      // add more streams
      service.setStreamList(testArrayWithMoreData);

      // check with first data
      expect(service.isNextStreamAvaliable(testData)).toBeTruthy();
      // check with last data
      expect(service.isNextStreamAvaliable(newStream)).toBeFalse();
    });
  });

  it('should goto next stream', (done: DoneFn) => {
    service.setStreamList(testArrayWithMoreData);
    // set current stream
    service.setStream(testData);

    service.gotoNextAvaliableStream(testData);

    service.stream.subscribe(data => {
      expect(data).toEqual(newStream);
      done();
    });
  });

});
