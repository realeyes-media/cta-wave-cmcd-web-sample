import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderAndNotificationService } from 'src/app/services/notification.service';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let loaderService: LoaderAndNotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderComponent ],
      providers: [ LoaderAndNotificationService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loaderService = fixture.debugElement.injector.get(LoaderAndNotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show loader in ui by default', () => {
    let loaderEle: HTMLElement = fixture.nativeElement;
    expect(loaderEle.querySelector('.loader')).toBeFalsy();
  });

  it('should show the loader in ui', () => {
    loaderService.showLoader();
    fixture.detectChanges();
    let loaderEle: HTMLElement = fixture.nativeElement;
    expect(loaderEle.querySelector('.loader')).toBeTruthy();
  });
});
