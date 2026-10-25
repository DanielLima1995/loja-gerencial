
import { Component, Input, OnInit } from '@angular/core';
import { globalModules } from '../../globalModules';
import { ToastMessage, ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports:[
    ...globalModules
  ]
})

export class ToastComponent implements OnInit {
  message = '';
  type: 'success' | 'info' | 'error' = 'info';

  constructor(public toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastState$.subscribe((toast: ToastMessage) => {
      this.message = toast.message;
      this.type = toast.type;
      this.toastService.visible = true;

      // Auto-hide after 3 seconds (optional)
      setTimeout(() => this.toastService.visible = false, 4000);
    });
  }

  get bgClass(): string {
    switch (this.type) {
      case 'success': return 'text-bg-success';
      case 'error': return 'text-bg-danger';
      case 'info':
      default: return 'text-bg-info';
    }
  }

  
}