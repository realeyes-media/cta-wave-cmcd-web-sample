import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VideoplayerComponent } from './components/videoplayer/videoplayer.component';
import { ListViewComponent } from './containers/list-view/list-view.component';
import { DetailViewComponent } from './containers/detail-view/detail-view.component';
import { LoaderComponent } from './components/loader/loader.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    VideoplayerComponent,
    ListViewComponent,
    DetailViewComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
