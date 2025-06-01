import { Component } from '@angular/core';

import { ProductDetailsService } from './product-details.service';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Produto, Tag } from '../../app.interface';
import { InputNumericoComponent } from '../../components/input-numerico/input-numerico.component';
import { ProdutosRelacionadosComponent } from '../../components/produtos-relacionados/produtos-relacionados.component';
import { SelectCoresComponent } from '../../components/select-cores/select-cores.component';
import { SelectTamanhosComponent } from '../../components/select-tamanhos/select-tamanhos.component';
import { globalModules } from '../../globalModules';
import { AuthService } from '../../services/auth.service';
import { GlobalFunctions } from '../../services/global.service';
import { CartService } from '../cart/cart.service';
import { CarregamentoComponent } from '../../components/carregamento/carregamento.component';

@Component({
  selector: 'app-product-details',
  imports: [...globalModules,
    
    
    InputNumericoComponent,
    ProdutosRelacionadosComponent,
    SelectCoresComponent,
    SelectTamanhosComponent,
    CarregamentoComponent,
    
  ],
   templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  produto!: Produto;
  idProduto: number = 0;
  tags: { [key: string]: Tag[] } = {};
  selectedColor: number = 0;
  currentValue: number = 1; // Valor inicial
  selectedTamanho: number = 0;
  changeImagemAtiva: number = 0;
  carregando:boolean = true;
  carregandoVenda:boolean = false;


  constructor(
    private produtoService: ProductDetailsService, private route: ActivatedRoute, private auth: AuthService, private router: Router,public globalFunctions: GlobalFunctions, public cartService: CartService
  ){
    this.idProduto = Number(this.route.snapshot.params['id']);
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.carregando = true;
      this.idProduto = +params['id'];
      this.resetaValores();
      this.init();
      
    });
  }

  init(){
    this.produtoService.getProduto(this.idProduto).subscribe(
      res => {
        this.produto = res?.data?.produto;
        this.tags = res?.data?.tags;
        this.carregando = false;

        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Faz o scroll suave
        });
      },
      () => {
        this.globalFunctions.alertaDadosServidor();
      }
    )
  }

  get coresDisponiveis(): Tag[]{
    if(!this.tags || !this.tags['Cores']) return [];

    return this.tags['Cores'];
  }

  get tamanhosDisponiveis(): Tag[]{
    if(!this.tags || !this.tags['Tamanho']) return [];

    return this.tags['Tamanho'];
  }


  alteraCor(e: number){
    this.selectedColor = e;
  }

  alteraTamanho(e: number){
    this.selectedTamanho = e;
  }

  sendCarrinho(){
    if(!this.selectedColor){
      this.globalFunctions.alerta('Selecione a Cor', 'É necessário selecionar uma cor antes de adicionar o produto ao carrinho.', 'error');
      return;
    }

    if(!this.currentValue){
      this.globalFunctions.alerta('Selecione a Quantidade', 'Por favor, selecione a quantidade de produtos antes de adicionar ao carrinho.', 'error');
      return;
    }

    if(!this.selectedTamanho){
      this.globalFunctions.alerta('Selecione o Tamanho', 'Por favor, selecione o tamanho do produto antes de adicionar ao carrinho.', 'error');
      return;
    }


    if(!this.auth.getToken()){

      let atual = localStorage.getItem('carrinho') ?? "[]";
      let novo = {
        id: this.route.snapshot.params['id'],
        quantidade: this.currentValue,
        cor: this.selectedColor,
        tamanho: this.selectedTamanho
      }

      let arrAtual: Array<any> = JSON.parse(atual); 
      
      
      if(arrAtual.filter(
        (item) => {
          return item.id == this.route.snapshot.params['id'] && item.cor == this.selectedColor
        }
      ).length > 0){
        arrAtual = arrAtual.map(
          (item) => {
            if(this.route.snapshot.params['id'] != item.id || item.cor != this.selectedColor ) return item;
            item.quantidade += this.currentValue;
            return item;
          }
        )
      }else{
        arrAtual.push(novo);
      }

      localStorage.setItem('carrinho', JSON.stringify(arrAtual));
      this.modalRedirect();
      
      return;
    }else{
      this.carregandoVenda = true;
      this.produtoService.gerenciarCarrinho([{
        quantidade: this.currentValue,
        cor: this.selectedColor,
        id: Number(this.idProduto),
        tamanho: this.selectedTamanho
      }]).subscribe(
        () => {
          this.carregandoVenda = false;
          this.cartService.getProdutos().subscribe(
            (response) => {
              this.cartService.carrinhoTratados = response?.data?.carrinhoProdutos;
            },
            () => {
              this.globalFunctions.alertaDadosServidor();
            }
          );          this.modalRedirect();
          localStorage.removeItem('carrinho');
        },
        () => {
          this.carregandoVenda = false;
          this.globalFunctions.alerta('Erro ao Adicionar ao Carrinho', 'Ocorreu um erro ao tentar adicionar o produto ao carrinho. Tente novamente.', 'error');
        }
      )
    }
  }

  modalRedirect(){
    Swal.fire({
      title: "Produto Adicionado no Carrinho",
      text: "Deseja continuar comprando?",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#198754",
      confirmButtonText: "Carrinho",
      cancelButtonText: "Continuar Comprando",
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/carrinho']);
      }
    });
  }
  
  gerenciaImagemAtiva(indice: number){
    this.changeImagemAtiva = indice;
  }

  resetaValores(){
    this.currentValue = 1,
    this.selectedColor = 0,
    this.idProduto = Number(this.route.snapshot.params['id']),
    this.selectedTamanho =  0
  }
}
