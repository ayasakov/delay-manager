import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from './core/services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  loading$ = new Subscription();
  isLoading: boolean;

  constructor(private loadingService: LoadingService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loading$ = this.loadingService.isLoading().subscribe(status => {
      this.isLoading = status;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.loading$.unsubscribe();
  }
}
