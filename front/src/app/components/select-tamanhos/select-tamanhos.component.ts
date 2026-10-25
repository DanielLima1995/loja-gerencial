
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { globalModules } from '../../globalModules';

@Component({
  selector: 'app-select-tamanhos',
  imports: [...globalModules,
    
  ],  templateUrl: './select-tamanhos.component.html',
  styleUrl: './select-tamanhos.component.scss'
})
export class SelectTamanhosComponent {
  @Input() items: any = [];
  @Input() actualItem: number = 0;
  @Input() onlySelected: boolean = false;

  @Output() selectedValue: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(){

  }

  get tamanhosDisponiveis(): any[]{
    if (Array.isArray(this.items)) return this.items;
    return this.items?.['Tamanho'] ?? [];
  }

  sendSelectedItem(value: number){
    this.actualItem = value;
    this.selectedValue.emit(value);
  }




}
