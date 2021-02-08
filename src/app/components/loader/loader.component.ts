import { Component, OnInit } from '@angular/core';
import { LoaderAndNotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loaderState$;

  constructor(private loadService: LoaderAndNotificationService) { }

  ngOnInit(): void {
    this.loaderState$ = this.loadService.loader;
  }

}
