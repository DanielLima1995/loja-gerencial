import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'info' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toastState$ = this.toastSubject.asObservable();
  visible = false;

  show(message: string, type: 'success' | 'info' | 'error' = 'info') {
    this.toastSubject.next({ message, type });
  }

  closeToast() {
    this.visible = false;
  }
}
