
import { Component, Input } from '@angular/core';

import { ProdutosRelacionadosService } from './produtos-relacionados.service';
import { Produto, setImagemPrincipal } from '../../app.interface';
import { globalModules } from '../../globalModules';
import { GlobalFunctions } from '../../services/global.service';
import { CarregamentoComponent } from '../carregamento/carregamento.component';
import { CardProdutoComponent } from '../card-produto/card-produto.component';

@Component({
  selector: 'app-produtos-relacionados',
  templateUrl: './produtos-relacionados.component.html',
  styleUrls: ['./produtos-relacionados.component.scss'],  // Certifique-se de usar styleUrls (plural)
  imports:[
    ...globalModules,
    CarregamentoComponent,
    CardProdutoComponent
    
  ]
})
export class ProdutosRelacionadosComponent {
  @Input() idProduto: number = 0;
  @Input() qtdTotalMobile: number = 2;
  @Input() qtdRowMobile: number = 1;
  @Input() titulo: string = 'Produtos Relacionados';
  @Input() qtdRow: number = 3;
  @Input() qtdTotal: number = 3;
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
      this.service.getProdutosRelacionados(this.idProduto || undefined).subscribe(
        res => {
          this.products = res
            .slice(0, this.qtdTotal)
            .map((produto: Produto) => setImagemPrincipal(produto));
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
