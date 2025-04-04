import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestStateService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observable para expor o estado de loading
  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  // Atualizar o estado de loading
  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }
}
