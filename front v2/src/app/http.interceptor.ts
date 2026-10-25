import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpRequestStateService } from './http-request-state.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private httpRequestState: HttpRequestStateService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.httpRequestState.setLoading(true); // Ativar estado de loading
    return next.handle(request).pipe(
      finalize(() => this.httpRequestState.setLoading(false)) // Desativar estado de loading ao finalizar
    );
  }
}
