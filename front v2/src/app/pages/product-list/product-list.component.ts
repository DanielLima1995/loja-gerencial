import { Component } from '@angular/core';
import { ProductListService } from './product-list.service';
import { ActivatedRoute } from '@angular/router';
import { mapTagsGroups, Produto, ProdutoFilter, setImagemPrincipal, TagsGrupo, TagsWithKeys } from '../../app.interface';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { globalModules } from '../../globalModules';
import { GlobalFunctions } from '../../services/global.service';
import { CardProdutoComponent } from '../../components/card-produto/card-produto.component';
import { CarregamentoComponent } from '../../components/carregamento/carregamento.component';

@Component({
  selector: 'app-product-list',
  imports: [
    ...globalModules,
    PaginationComponent,
    CarregamentoComponent,
    CardProdutoComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',

})
  export class ProductListComponent {
    carregando = true;
    products: Produto[] = [];
    paginaAtual = 1;
    qtdElementosPagina = 15;
    currentPage: number = 1;
    totalPages: number = 1;
    tags!: TagsWithKeys;
    collapses: { [key: string]: boolean } = {};
    filtros: Record<string, string | number | undefined> = {};
    stringBusca = '';
    isMobile: boolean = false;
    showFiltros: boolean = false;

    constructor(
      private service: ProductListService,
      private route: ActivatedRoute,
      public globalFunctions: GlobalFunctions
    ){
      
    }
  
    ngOnInit(){
      this.route.queryParams.subscribe((params: any) => {
        
        if (typeof window !== "undefined") {
          let l = window.screen.width;
          this.isMobile = (l < 900);
          this.qtdElementosPagina = 15;
          this.filtros['busca'] = params.busca;
          this.init();
        }
      });
    }

    init(){
      this.gerGetProdutos();

      this.service.getTags().subscribe(
        res => {
          this.tags = mapTagsGroups(res as TagsGrupo[]);
        },
        () => {
          this.globalFunctions.alertaDadosServidor();
        }
      )
    }

    gerGetProdutos(page: number = this.currentPage ){
      this.carregando = true;
      this.service.getProdutos(page, this.sendFiltros, this.qtdElementosPagina).subscribe(
        res => {
          this.products = res.items.map((produto: Produto) => setImagemPrincipal(produto));
          this.currentPage = res.page;
          this.totalPages = res.totalPages;
          this.carregando = false;
        },
        () => {
          this.globalFunctions.alertaDadosServidor();
        }
      )
    }
    get filterProdutos(){
      return this.products.filter((p,i: number) => {
        return (((this.qtdElementosPagina * this.paginaAtual) - 1) >= i) && (i >= ((this.qtdElementosPagina * this.paginaAtual) - this.qtdElementosPagina))
      })
    }
  
    get qtdPaginacoes(): number{
      return Math.ceil((this.products?.length ?? 0) / this.qtdElementosPagina);
    }
  
    onPageChanged(page: number): void {
      this.gerGetProdutos(page);
    }

    gerenciaCollapse(indice: string){
      this.collapses[indice] = (this.collapses[indice] ? false : true);
    }

    collapseFiltros(item: string, valor: number){
      this.filtros[item] = valor;
      this.paginaAtual = 1;
      this.gerGetProdutos();
    }

    get sendFiltros(): Partial<ProdutoFilter> {
      const filtros: Partial<ProdutoFilter> = {};
      const titulo = this.filtros['busca'];
      if (titulo) {
        filtros.titulo = String(titulo);
      }

      const tags = Object.entries(this.filtros)
        .filter(([key, value]) => key !== 'busca' && value !== undefined)
        .map(([, value]) => String(value));
      if (tags.length) {
        filtros.tags = tags.join(',');
      }

      return filtros;
    }
    
    refatoraDescricao(text: string){
      if (typeof text !== 'string') {
        throw new Error('O parâmetro deve ser uma string');
      }

      let l = (this.isMobile ? 15 : 70);
      return text.slice(0, l) + (text.length > l ? '...' : '');
    }

    changeConteudoFiltros(){
      this.showFiltros = !this.showFiltros; 
    }
  }