import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../core/services/loading.service';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({headers: req.headers});
    this.loadingService.value = true;

    return next.handle(request).pipe(
      finalize(() => this.loadingService.isLoading() ?
        this.loadingService.value = false :
        null)
    );
  }
}
