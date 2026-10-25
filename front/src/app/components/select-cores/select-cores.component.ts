
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { globalModules } from '../../globalModules';

@Component({
  selector: 'app-select-cores',
  imports: [...globalModules,
    
    

  ],  templateUrl: './select-cores.component.html',
  styleUrl: './select-cores.component.scss'
})
export class SelectCoresComponent {
  @ViewChild('selectCores') selectCores!: ElementRef; // Referência ao input oculto

  @Input() tags: any = [];
  @Input() actualColor: number = 0;
  @Input() disabled: boolean = false;

  @Output() selectedColor: EventEmitter<number> = new EventEmitter<number>();
  formulario: FormGroup;

  constructor(public fb: FormBuilder){
    this.formulario = this.fb.group({
      corSelecionada: ['']
    });
  }
  ngOnInit(){
    this.formulario.patchValue({
      corSelecionada: this.actualColor
    })
    if(this.disabled){
      this.formulario.get('corSelecionada')?.disable();
    }
  }

  get coresDisponiveis(): any[]{
    if (Array.isArray(this.tags)) return this.tags;
    return this.tags?.['Cores'] ?? [];
  }

  sendSelectedColor(){
    let item = this.formulario.get('corSelecionada');
    if(item != null){
      this.selectedColor.emit(item.value);
    }
  }


}
