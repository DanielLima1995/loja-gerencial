
import { Component } from '@angular/core';

import { VendasComponent } from '../../admin/vendas/vendas.component';
import { globalModules } from '../../../globalModules';

@Component({
  selector: 'app-vendas-cliente',
  imports: [...globalModules,
    
    
    VendasComponent
  ],
  templateUrl: './vendas-cliente.component.html',
})
export class VendasClienteComponent {
  idEndereco: number = 0;

  constructor() {
    

  }

  ngOnInit(): void {
    
  }

  
}
