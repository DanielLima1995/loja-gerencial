
import { Component, Input } from '@angular/core';

import { ProdutosRelacionadosService } from './produtos-relacionados.service';
import { Produto } from '../../app.interface';
import { globalModules } from '../../globalModules';
import { CarregamentoComponent } from '../carregamento/carregamento.component';
import { GlobalFunctions } from '../../services/global.service';

@Component({
  selector: 'app-produtos-relacionados',
  templateUrl: './produtos-relacionados.component.html',
  styleUrls: ['./produtos-relacionados.component.scss'],  // Certifique-se de usar styleUrls (plural)
  imports:[
    ...globalModules,
    CarregamentoComponent
    
  ]
})
export class ProdutosRelacionadosComponent {
  @Input() idProduto: number = 0;
  @Input() qtdTotalMobile: number = 4;
  @Input() qtdRowMobile: number = 1;
  @Input() titulo: string = 'Produtos Relacionados';
  @Input() qtdRow: number = 4;
  @Input() qtdTotal: number = 4;
  @Input() showDescricao: boolean = true;

  products: Produto[] = [];
  carregando: boolean = false;

    constructor(
      private service: ProdutosRelacionadosService,
      public GlobalFunctions: GlobalFunctions
    ){
    }
  
    ngOnInit(){
      this.carregando = true;
      this.service.getProdutosRelacionados(null, this.qtdTotal).subscribe(
        res => {
          this.products = res.data;
          this.carregando = false;
        },
        () => {
          this.GlobalFunctions.alertaDadosServidor();
        }


      )
    }

    afterNextRender(){

    }

    get colsMobile(): number{
      return 12 / this.qtdRowMobile;
    }

    get colsScreen(): number{
      return 12 / this.qtdRow;
    }

    
    refatoraDescricao(text: string){
      if (typeof text !== 'string') {
        throw new Error('O parâmetro deve ser uma string');
      }

      let l = (this.GlobalFunctions.isMobile ? 15 : 70);
      return text.slice(0, l) + (text.length > l ? '...' : '');
    }
}
