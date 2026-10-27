import { Component, Input } from '@angular/core';

import Swal from 'sweetalert2';
import { VendasService } from './vendas.service';
import { ActivatedRoute } from '@angular/router';
import { Vendas } from '../../../app.interface';
import { CarregamentoComponent } from '../../../components/carregamento/carregamento.component';
import { globalModules } from '../../../globalModules';
import { GlobalFunctions } from '../../../services/global.service';

@Component({
  selector: 'app-vendas-detalhes',
  imports: [
    ...globalModules,
    CarregamentoComponent
  ],
  templateUrl: './vendas-detalhes.component.html',
  styleUrl: './vendas-detalhes.component.scss',

})
  export class VendasDetalhesComponent {
    carregando = true;
    venda!: Vendas;
    idVenda:number = 0
    @Input() isCliente: boolean = false;

    constructor(
      private vendasService: VendasService, private route: ActivatedRoute, public globalFunctions: GlobalFunctions
    ){
      this.idVenda = this.route.snapshot.params['id'];
    }
  
    ngOnInit(){
      this.vendasService.getVenda(this.idVenda).subscribe(
        res => {
          this.venda = {
            ...res,
            quantidadeTotal: res.produtos?.reduce((total, produto) => total + Number(produto?.quantidade ?? 0), 0) ?? 0,
          };
          this.carregando = false;
        },
        () => {
          this.globalFunctions.alertaDadosServidor();
        }
      );
    }

  }