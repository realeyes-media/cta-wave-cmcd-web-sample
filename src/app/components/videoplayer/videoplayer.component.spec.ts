import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoplayerComponent } from './videoplayer.component';

describe('VideoplayerComponent', () => {
  let component: VideoplayerComponent;
  let fixture: ComponentFixture<VideoplayerComponent>;
  let videoComponentElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoplayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    videoComponentElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the video player', () => {
    expect(videoComponentElement.querySelector('video')).toBeTruthy();
  });

  it('should not show custom controls', () => {
    expect(videoComponentElement.querySelector('.player-controls')).toBeFalsy();
  });

  it('should show video player custom controls', () => {
    component.playerIsReady = true;
    fixture.detectChanges();
    expect(videoComponentElement.querySelector('.player-controls')).toBeTruthy();
  });

  it('should show error messages', () => {
    let verrormessage = 'hello'
    component.errormessage = verrormessage;
    fixture.detectChanges();
    expect(videoComponentElement.querySelector('.errormessage')).toBeTruthy();
    expect(videoComponentElement.querySelector('.errormessage').textContent).toContain(verrormessage);
  });
});
