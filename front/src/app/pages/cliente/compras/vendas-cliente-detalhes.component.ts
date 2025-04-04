
import { Component } from '@angular/core';

import { VendasDetalhesComponent } from '../../admin/vendas/vendas-detalhes.component';
import { globalModules } from '../../../globalModules';

@Component({
  selector: 'app-vendas-cliente-detalhes',
  imports: [...globalModules,
    
    
    VendasDetalhesComponent
  ],
  templateUrl: './vendas-cliente-detalhes.component.html',
})
export class VendasClienteDetalhesComponent {
  idEndereco: number = 0;

  constructor() {
    

  }

  ngOnInit(): void {
    
  }

  
}
