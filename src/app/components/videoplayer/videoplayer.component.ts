import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as HLS from 'hls.js';
import { LoaderAndNotificationService } from 'src/app/services/notification.service';
import { VideoPlayerService } from 'src/app/services/videoplayer.service';
import { HlsSamples } from "src/app/interfaces/HLS-sample-datatype";

import { StreamingFormat } from "src/app/interfaces/StreamingFormat";
import { CMCDAppManager } from "src/app/services/CMCDAppManager";
import { XhrLoader } from "src/app/services/XhrLoader";

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements OnInit, AfterViewInit {

  videoContainer: HTMLDivElement;
  videoElement: HTMLVideoElement;
  progressEle: HTMLProgressElement;
  cmcdDebug: HTMLDivElement;

  playerIsReady = false;
  currentStream: HlsSamples;
  errormessage;

  @ViewChild('videoContainer') set navtiveVideoContainerElement(el: ElementRef) {
    this.videoContainer = el.nativeElement;
  }

  @ViewChild('player') set navtivePlayerElement(el: ElementRef) {
    this.videoElement = el.nativeElement;
  }

  @ViewChild('progressElement') set navtiveProgressElement(el: ElementRef) {
    if (el?.nativeElement) this.progressEle = el.nativeElement;
  }

  @ViewChild('cmcdDebugEle') set cmcdDebugEle(el: ElementRef) {
    if (el?.nativeElement) this.cmcdDebug = el.nativeElement;
  }

  hls: HLS;
  private cmcdManager?: CMCDAppManager;

  constructor(
    private vidService: VideoPlayerService,
    private loaderService: LoaderAndNotificationService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.videoElement.controls = false;

    if (HLS.isSupported()) {
      this.vidService.stream.subscribe((res: HlsSamples) => {
        if (res && res.src) {
          this.errormessage = false;
          this.currentStream = res;
          this.setupPlayer(res);
        }
      })
    } else {
      console.log('HLS Not Supported');
      this.errormessage = 'HLS Not Supported. Plese Upgrade your Browser or Try Google Chrome.';
    }
  }

  setupPlayer(media: HlsSamples) {
    if (this.hls) {
      this.performCleanup();
    }

    this.initCMCDManager(media);

    XhrLoader.cmcdManager = this.cmcdManager;
    XhrLoader.debugEl = this.cmcdDebug;

    this.hls = new HLS({ loader: XhrLoader });

    this.hls.attachMedia(this.videoElement);

    this.hls.on(HLS.Events.MEDIA_ATTACHED, () => {
      this.hls.loadSource(media.src);
    });

    this.setUpEventListner();
  }

  setUpEventListner() {
    // Loader events
    this.hls.on(HLS.Events.MANIFEST_LOADING, () => {
      this.showLoader();
    });

    this.hls.on(HLS.Events.MANIFEST_PARSED, () => {
      this.videoElement.play();
    });

    this.hls.on(HLS.Events.FRAG_LOADED, () => {
      this.playerIsReady = true;
      this.hideLoader();
    });

    // this.hls?.on(HLS.Events.MEDIA_ATTACHED, () => this.onMediaAttached());
    this.hls?.on(HLS.Events.LEVEL_UPDATED, (_, data) => this.onLevelUpdated(data));
    this.hls?.on(HLS.Events.FRAG_BUFFERED, () => this.onFragBuffered());

    this.videoElement.addEventListener("ratechange", () => this.onPlaybackRateChanged());

    this.videoElement.addEventListener('loadedmetadata', () => {
      this.progressEle.setAttribute('max', String(this.videoElement.duration));
    });

    this.videoElement.addEventListener('timeupdate', () => {
      if (this.progressEle && !this.progressEle.getAttribute('max')) {
        this.progressEle.setAttribute('max', String(this.videoElement.duration));
      }
      if (this.progressEle) this.progressEle.value = this.videoElement.currentTime;
    });

    this.videoElement.addEventListener("ratechange", () => this.onPlaybackRateChanged());

    this.videoElement.addEventListener('ended', () => {
      if (this.isNextStreamAvaliable()) {
        this.nextStream();
      }
    });

    this.handleErrorEvents();
  }

  handleErrorEvents() {
    this.hls.on(HLS.Events.ERROR, (event, data) => {
      console.warn('Error: event: ', event, ' data: ', data);
      this.loaderService.hideLoader();

      if (data.fatal) {
        switch(data.type) {
        case HLS.ErrorTypes.NETWORK_ERROR:
          // try to recover network error
          if (data.response && data.response.code == 404) {
            this.errormessage = 'fatal network error encountered. File Not Found';
          } else {
            this.errormessage = 'fatal network error encountered, trying to recover';
            if (this.hls) this.hls.startLoad();
          }
          break;
        case HLS.ErrorTypes.MEDIA_ERROR:
          this.errormessage = data['reason'] ? data['reason'] : 'fatal media error encountered, trying to recover';
          // if (this.hls) this.hls.recoverMediaError();
          break;
        default:
          // cannot recover
          // throw error
          this.errormessage = 'Error fatal. Please try again.';
          this.hls.destroy();
          break;
        }
      }
    });
  }

  performCleanup() {
    this.hls?.detachMedia();
    this.hls?.destroy();
    this.hls = undefined;
    XhrLoader.debugEl = undefined;
    XhrLoader.cmcdManager = undefined;
  }

  private initCMCDManager(media: HlsSamples) {
    let format: StreamingFormat;
    switch (media.format) {
        case "hls":
            format = StreamingFormat.HLS;
        case "dash":
            format = StreamingFormat.MPEG_DASH;
        case "smooth":
            format = StreamingFormat.SMOOTH_STREAMING;
        default:
            format = StreamingFormat.HLS;
    }
    this.cmcdManager = new CMCDAppManager(media.id, format);
  }

  private onLevelUpdated(data: Hls.levelUpdatedData): void {
    const lvl = this.hls?.levels[data.level];
    if (lvl != null) {
        const bitrate = lvl.bitrate;
        this.cmcdManager?.updateEncodedBitrate(bitrate);
    }
  }

  private onFragBuffered(): void {
    const playhead = this.videoElement.currentTime;
    const bufferedTimeRanges = this.videoElement.buffered;

    for (let i = 0; i < bufferedTimeRanges.length, i++; ) {
        const start = bufferedTimeRanges.start(i);
        const end = bufferedTimeRanges.end(i);
        if (playhead >= start && playhead < end) {
            const totalBuffer = end - playhead;
            this.cmcdManager?.updateBufferLength(totalBuffer);
            this.cmcdManager?.updateDeadline(totalBuffer);
            return;
        }
    }
  }

  private onPlaybackRateChanged() {
    this.cmcdManager?.updatePlaybackRate(this.videoElement.playbackRate);
  }

  showLoader() {
    this.loaderService.showLoader();
  }

  hideLoader() {
    this.loaderService.hideLoader();
    this.errormessage = false;
  }

  playOrPauseVideo() {
    if (this.videoElement.paused || this.videoElement.ended) {
      this.videoElement.play();
    } else {
      this.videoElement.pause();
    }

  }

  muteOrUnmuteVideo() {
    this.videoElement.muted = !this.videoElement.muted;
  }

  skipAhead(event) {
    if (!this.progressEle) return;
    const pos = (event.pageX  - this.progressEle.offsetLeft) / this.progressEle.offsetWidth;
    const finalPos = pos * this.videoElement.duration;
    this.videoElement.currentTime = finalPos;
    this.progressEle.value = finalPos;
  }

  convertTime(time: number) {
    return (+time / 60).toFixed(2);
  }

  isUserInFullScreen() {
    // @ts-ignore
    return !!(document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
  }

  setFullScreen() {
    if (this.isUserInFullScreen()) {
      if (document.exitFullscreen) document.exitFullscreen(); // @ts-ignore
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen(); // @ts-ignore
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen(); // @ts-ignore
      else if (document.msExitFullscreen) document.msExitFullscreen();
   }
   else {
      if (this.videoContainer.requestFullscreen) this.videoContainer.requestFullscreen(); // @ts-ignore
      else if (this.videoContainer.mozRequestFullScreen) this.videoContainer.mozRequestFullScreen(); // @ts-ignore
      else if (this.videoContainer.webkitRequestFullScreen) this.videoContainer.webkitRequestFullScreen(); // @ts-ignore
      else if (this.videoContainer.msRequestFullscreen) this.videoContainer.msRequestFullscreen();
   }
  }

  isNextStreamAvaliable() {
    return !!this.vidService.isNextStreamAvaliable(this.currentStream);
  }

  nextStream() {
    this.vidService.gotoNextAvaliableStream(this.currentStream);
  }

}
