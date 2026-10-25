
import { Component, Input } from '@angular/core';

import { globalModules } from '../../globalModules';
@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss'],  // Certifique-se de usar styleUrls (plural)
  imports:[
    ...globalModules
  ]
})
export class AvaliacaoComponent {

  constructor(
  ){
  }

}
