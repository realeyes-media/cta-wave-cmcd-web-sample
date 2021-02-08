import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoplayerComponent } from 'src/app/components/videoplayer/videoplayer.component';

import { DetailViewComponent } from './detail-view.component';

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let fixture: ComponentFixture<DetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailViewComponent, VideoplayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain videoplayer component', () => {
    const detailElement: HTMLElement = fixture.nativeElement;
    expect(detailElement.querySelector('app-videoplayer')).toBeTruthy();
  });
});
