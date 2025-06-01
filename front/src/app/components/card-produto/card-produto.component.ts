
import { Component, Input } from '@angular/core';

import { globalModules } from '../../globalModules';
import { AvaliacaoComponent } from '../avaliacao/avaliacao.component';
import { GlobalFunctions } from '../../services/global.service';
@Component({
  selector: 'app-card-produto',
  templateUrl: './card-produto.component.html',
  styleUrls: ['./card-produto.component.scss'],  // Certifique-se de usar styleUrls (plural)
  imports:[
    ...globalModules,
    AvaliacaoComponent
  ]
})
export class CardProdutoComponent {
  @Input() imagem: string = '';
  @Input() link: string = '';
  @Input() titulo: string = '';
  @Input() descricao: string = '';
  @Input() valor: any = '';

  constructor(
      public globalFunctions: GlobalFunctions
  ){
  }
  
  ngOnInit() {
    if (this.valor && typeof this.valor != 'number') {
      this.valor = this.valor.replace('R$ ', '').replace(',', '.');
      this.valor = parseFloat(this.valor);
    }
  }

}
