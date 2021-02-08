import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HlsSamples } from 'src/app/interfaces/HLS-sample-datatype';
import { ApiService } from 'src/app/services/api.service';
import { VideoPlayerService } from 'src/app/services/videoplayer.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  streamList: HlsSamples[];

  constructor(private api: ApiService, private vidService: VideoPlayerService) { }

  ngOnInit(): void {
    this.api.fetchSampleData().subscribe(data => {
      this.streamList = data;

      this.vidService.setStreamList(data);
      // auto select first stream
      this.autoSelectFirstAvaliableStream(data);
    });
  }

  autoSelectFirstAvaliableStream(allStreamList) {
    if (allStreamList && allStreamList.length > 0) {
      const firstStream = allStreamList[0];
      this.streamSelected(firstStream);
    }
  }

  streamSelected(item) {
    this.vidService.setStream(item);
  }

}
