import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ListViewComponent } from './list-view.component';
import { ApiService } from 'src/app/services/api.service';
import { of } from 'rxjs';
import { VideoPlayerService } from 'src/app/services/videoplayer.service';
import { HlsSamples } from 'src/app/interfaces/HLS-sample-datatype';

const testData: HlsSamples[] = [
  {
    "name": "Big Buck Bunny",
    "src": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  },
  {
    "name": 'test data',
    "src": 'test_url'
  }
];

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let mockApiServiceSpy: { fetchSampleData: jasmine.Spy };
  let videoPlayerService: VideoPlayerService;

  beforeEach(async () => {
    mockApiServiceSpy = jasmine.createSpyObj('ApiService', ['fetchSampleData']);
    mockApiServiceSpy.fetchSampleData.and.returnValue(of(testData));

    await TestBed.configureTestingModule({
      declarations: [ ListViewComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: ApiService, useValue: mockApiServiceSpy},
        VideoPlayerService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    videoPlayerService = fixture.debugElement.injector.get(VideoPlayerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check streamlist is set', () => {
    expect(component.streamList).toEqual(testData);
  });

  it('should show list of streams on ui', () => {
    let listviewElement: HTMLElement = fixture.nativeElement;
    expect(listviewElement.querySelectorAll('li').length).toEqual(testData.length);
  });

  it('should set videoplayer stream', (done: DoneFn) => {
    component.streamSelected(testData[1]);
    videoPlayerService.stream.subscribe(data => {
      expect(data).toEqual(testData[1]);
      done();
    });
  });
});
