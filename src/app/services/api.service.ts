import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HlsSamples } from '../interfaces/HLS-sample-datatype';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  fetchSampleData() {
    return this.httpClient.get<HlsSamples[]>('/assets/HLS-samples-data.json')
  }
}
