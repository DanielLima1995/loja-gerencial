import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: (typeof window !== 'undefined' && localStorage.getItem('authToken') ? ('Bearer ' + localStorage.getItem('authToken')) : '')  // Adicionando o token nas requisições
      }
    });

    return next.handle(clonedRequest);
  }
}
