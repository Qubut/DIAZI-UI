import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loadingFinished, loadingStarted } from 'src/app/stores/spinner/spinner.actions';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private store: Store) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.store.dispatch(loadingStarted());

    return next.handle(req).pipe(
      finalize(() => this.store.dispatch(loadingFinished()))
    );
  }
}