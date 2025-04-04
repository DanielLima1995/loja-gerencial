
import { Component, Input } from '@angular/core';

import { globalModules } from '../../globalModules';
@Component({
  selector: 'app-carregamento',
  templateUrl: './carregamento.component.html',
  styleUrls: ['./carregamento.component.scss'],  // Certifique-se de usar styleUrls (plural)
  imports:[
    ...globalModules
  ]
})
export class CarregamentoComponent {
  constructor(
  ){
  }

}
