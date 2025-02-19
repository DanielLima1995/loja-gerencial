import { Component, Input } from '@angular/core';


import Swal from 'sweetalert2';
import { VendasService } from './vendas.service';
import { Vendas } from '../../../app.interface';
import { CarregamentoComponent } from '../../../components/carregamento/carregamento.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { globalModules } from '../../../globalModules';
import { GlobalFunctions } from '../../../services/global.service';


@Component({
  selector: 'app-vendas',
  imports: [...globalModules,
    ...globalModules,
    PaginationComponent,
    CarregamentoComponent
  ],
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.scss',

})
  export class VendasComponent {
    @Input() isCliente: boolean = false;
    vendas: Vendas[] = [];
    paginaAtual = 1;
    qtdElementosPagina = 5;
    currentPage: number = 1;
    totalPages: number = 1;
    collapses: { [key: string]: boolean } = {};
    filtros: { [key: string]: string } = {};
    statusEnvio = ['Em Processamento', 'Pagamento Aprovado', 'Separação', 'Enviado', 'Em Trânsito', 'Entregue'];
    baseRouter = '';
    carregando = true;

    constructor(
      private vendasService: VendasService,
      public globalFunctions: GlobalFunctions
    ){
  
    }
  
    ngOnInit(){
      this.gerGetVendas();
      this.baseRouter = this.isCliente ? '/cliente/pedidos/detalhes/' : '/admin/venda/';
    }

    gerGetVendas(page: number = this.currentPage ){
      this.vendasService.getVendas(page).subscribe(
        res => {
          this.carregando = false;
          this.vendas = res.data;
          this.currentPage = res.meta.current_page;
          this.totalPages = res.meta.last_page;
        }
      ),
      () => {
        this.globalFunctions.alertaDadosServidor();
      }
    }

    gerenciaCollapse(indice: number){
      this.collapses[indice] = (this.collapses[indice] ? false : true);
    }

    onPageChanged(page: number): void {
      this.gerGetVendas(page);
    }

    

    get filterProdutos(){
      return this.vendas.filter((p,i: number) => {
        return (((this.qtdElementosPagina * this.paginaAtual) - 1) >= i) && (i >= ((this.qtdElementosPagina * this.paginaAtual) - this.qtdElementosPagina))
      })
    }
  
    get qtdPaginacoes(): number{
      return Math.ceil((this.vendas?.length ?? 0) / this.qtdElementosPagina);
    }

    alteraStatus(id: number, event: Event){
      const input = event.target as HTMLInputElement;

      Swal.fire({
        title: "Alterar Status",
        text: "Deseja realmente alterar o status do pedido para " + input.value + " ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#d33",
        confirmButtonText: "Alterar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.vendasService.alteraStatusVenda(id, input.value).subscribe(
            () => {
              this.globalFunctions.alerta('Status Atualizado', 'O status do pedido foi atualizado com sucesso.', 'success');
            } ,
            () => {
              this.globalFunctions.alerta('Erro ao Atualizar Status', 'Ocorreu uma falha ao atualizar o status do pedido. Tente novamente.', 'error');
            }
          );
        }
      });
    }
  }