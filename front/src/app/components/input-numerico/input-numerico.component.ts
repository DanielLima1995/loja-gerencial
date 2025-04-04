
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { globalModules } from '../../globalModules';

@Component({
  selector: 'app-input-numerico',
  imports: [...globalModules,
    
  ],  templateUrl: './input-numerico.component.html',
  styleUrl: './input-numerico.component.scss'
})
export class InputNumericoComponent {

  @Input() value: number = 0; // Valor inicial
  @Input() min: number = 0;   // Valor mínimo
  @Input() max: number = 100; // Valor máximo
  @Input() step: number = 1;  // Incremento/decremento
  @Input() disabled: boolean = false;

  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  increment() {
    if (this.value < this.max) {
      this.value += this.step;
      this.valueChange.emit(this.value);
    }
  }

  decrement() {
    if (this.value > this.min) {
      this.value -= this.step;
      this.valueChange.emit(this.value);
    }
  }
  
}
