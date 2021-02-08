import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { VideoplayerComponent } from './components/videoplayer/videoplayer.component';
import { DetailViewComponent } from './containers/detail-view/detail-view.component';
import { ListViewComponent } from './containers/list-view/list-view.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        AppComponent,
        LoaderComponent,
        DetailViewComponent,
        ListViewComponent,
        VideoplayerComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'hlsvideoplayer'`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('HLS Video Player');
  });

  it('should render loadercomponent', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-loader')).toBeTruthy();
  });

  it('should contain list and detail components', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('.container').children.length).toEqual(2);
  });

});
