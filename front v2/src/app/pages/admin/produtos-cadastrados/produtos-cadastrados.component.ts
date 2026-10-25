import { Component } from '@angular/core';

import Swal from 'sweetalert2';
import { ProdutosCadastradosService } from './produtos-cadastrados.service';
import { CarregamentoComponent } from '../../../components/carregamento/carregamento.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { globalModules } from '../../../globalModules';
import { GlobalFunctions } from '../../../services/global.service';
import { Produto, setImagemPrincipal } from '../../../app.interface';


@Component({
  selector: 'app-produtos-cadastrados',
  imports: [
    ...globalModules,
    PaginationComponent,
    CarregamentoComponent
    

  ],
  templateUrl: './produtos-cadastrados.component.html',
  styleUrl: './produtos-cadastrados.component.scss',

})
  export class ProductCadastradosComponent {

    products: Produto[] = [];
    paginaAtual = 1;
    qtdElementosPagina = 15;
    currentPage: number = 1;
    totalPages: number = 1;
    collapses: { [key: string]: boolean } = {};
    filtros: { [key: string]: string } = {};
    carregando: boolean = false;

    constructor(
      private service: ProdutosCadastradosService,
      public globalFunctions: GlobalFunctions
    ){
  
    }
  
    ngOnInit(){
      this.carregando = true;
      this.gerGetProdutos();

    }

    gerGetProdutos(page: number = this.currentPage ){
      this.service.getProdutos(page).subscribe(
        res => {
          this.products = res.items.map((produto: Produto) => setImagemPrincipal(produto));
          this.currentPage = res.page;
          this.totalPages = res.totalPages;
          this.carregando = false;

        },() => {
          this.globalFunctions.alertaDadosServidor();
        }
      )
    }
    get filterProdutos(){
      return this.products.filter((p: Produto,i: number) => {
        return (((this.qtdElementosPagina * this.paginaAtual) - 1) >= i) && (i >= ((this.qtdElementosPagina * this.paginaAtual) - this.qtdElementosPagina))
      })
    }
  
    get qtdPaginacoes(): number{
      return Math.ceil((this.products?.length ?? 0) / this.qtdElementosPagina);
    }
  
    onPageChanged(page: number): void {
      this.gerGetProdutos(page);
    }

    gerenciaCollapse(indice: number){
      this.collapses[indice] = (this.collapses[indice] ? false : true);
    }

    collapseFiltros(item: string, valor: string){
      this.filtros[item] = valor;
      this.paginaAtual = 1;
      this.gerGetProdutos();
    }

    excluirProduto(id: number){
      Swal.fire({
        title: "Excluir Produto?",
        text: "Você realmente deseja excluir este produto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
            this.service.removeProduto(id).subscribe(
              () => {
                this.globalFunctions.alerta('Produto Excluído', 'Produto excluído com sucesso.', 'success');
                this.gerGetProdutos();
              },() => {
                this.globalFunctions.alerta('Erro ao Excluir Produto', 'Ocorreu uma falha ao tentar excluir o produto. Tente novamente.', 'error');
              }
            );
        }
      });
    }

  }