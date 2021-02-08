import { Injectable } from '@angular/core';
import { HlsSamples } from '../interfaces/HLS-sample-datatype';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {

  private currentStream = new BehaviorSubject<HlsSamples>(null);

  private streamList: HlsSamples[];

  constructor() { }

  get stream () {
    return this.currentStream.asObservable();
  }

  setStream(streamObject: HlsSamples) {
    if (streamObject) {
      this.currentStream.next(streamObject);
    }
  }

  setStreamList(list: HlsSamples[]) {
    if (list && Array.isArray(list) && list.length > 0) {
      return this.streamList = list.slice();
    }
  }

  isNextStreamAvaliable(currentStream: HlsSamples) {
    if (!currentStream) return false;

    if (!this.streamList || this.streamList.length == 0) return false;

    const currentStreamIndex = this.streamList.findIndex(e => e.src == currentStream.src);

    // index not found
    if (currentStreamIndex < 0) return false;

    const nextStreamIndex = currentStreamIndex + 1;
    const nextStream = this.streamList[nextStreamIndex];

    if (nextStream && nextStream.src) {
      return nextStream;
    } else {
      return false;
    }
  }

  gotoNextAvaliableStream(currentStream: HlsSamples) {

    const nextStream = this.isNextStreamAvaliable(currentStream);

    if (!nextStream) return;

    this.setStream(nextStream);
  }

}
