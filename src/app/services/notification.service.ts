import { Injectable } from '@angular/core';
import { HlsSamples } from '../interfaces/HLS-sample-datatype';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderAndNotificationService {

  private _loader = new BehaviorSubject(false);

  constructor() { }

  get loader () {
    return this._loader.asObservable();
  }

  showLoader() {
    this._loader.next(true);
  }

  hideLoader() {
    this._loader.next(false);
  }

}
