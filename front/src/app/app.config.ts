import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { HttpInterceptorService } from './http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptorsFromDi()), // Configuração do HttpClient com interceptores
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Adiciona o SampleInterceptor
      multi: true  // Permite que múltiplos interceptores sejam usados
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ]
};
