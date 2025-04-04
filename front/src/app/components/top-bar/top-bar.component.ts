
import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../pages/cart/cart.service';
import { CarrinhoProdutos, Menu, Produto, TagsProdutos } from '../../app.interface';
import { globalModules } from '../../globalModules';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GlobalFunctions } from '../../services/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],  // Certifique-se de usar styleUrls (plural)
  imports:[
    ...globalModules
    
  ]
})
export class TopBarComponent {
  busca: string = '';
  isDropdownOpen = false;
  isDropdownUsuarioOpen = false;
  carrinhoTratados: Produto[] = [];
  produtosDados: Array<CarrinhoProdutos> = [];

  isLogado = false;
  private subscription!: Subscription;
  
  constructor(
    private service: CartService,
    public authService: AuthService,
    private router: Router,
    public GlobalFunctions: GlobalFunctions,
  ){
  }

  showDropdown() {
    this.isDropdownOpen = true;
  }

  hideDropdown() {
    this.isDropdownOpen = false;
  }

  showUsuarioDropdown() {
    this.isDropdownUsuarioOpen = true;
  }

  hideUsuarioDropdown() {
    this.isDropdownUsuarioOpen = false;
  }

  ngOnInit(){
    this.subscription = this.authService.isUsuarioLogado$.subscribe((isLogado) => {
      this.isLogado = isLogado;
      this.init();
    });

    if(typeof window !== 'undefined'){
      let l = window.screen.width;
      this.GlobalFunctions.isMobile = (l < 900);
      this.GlobalFunctions.showMenuInterno = !this.GlobalFunctions.isMobile;
    }
  }

  init(){
    if(this.isLogado){
      this.service.getProdutos().subscribe(
        (response) => {
          this.carrinhoTratados = this.trataProdutosCarrinho(response?.data?.carrinhoProdutos);
        },
        () => {
          this.GlobalFunctions.alertaDadosServidor();
        }
      );
    }else{
      if(typeof window !== 'undefined' && localStorage.getItem('carrinho')){
        this.produtosDados = JSON.parse(localStorage.getItem('carrinho') ?? "[]"); 
        let ids = this.produtosDados.map(
          (item: CarrinhoProdutos) => item.id
        );

        this.service.getProdutosDados(ids).subscribe(
          (response) => {
            this.carrinhoTratados = this.trataProdutosDados(response.data);
          },
          () => {
            this.GlobalFunctions.alertaDadosServidor();
          }
        );
      }
    }
  }

  trataProdutosCarrinho(produtos: Array<CarrinhoProdutos>){

    return produtos.map(
    (item: CarrinhoProdutos) => {
      item.produto.cor = item.cor;
      item.produto.quantidade = item.quantidade;
      item.produto.refId = item.id;
      item.produto.tamanho_descricao = item.tamanho_detalhes?.descricao;
      item.produto.tag_descricao = item.tag?.descricao;


      return item.produto;
    }
    )
  }

  trataProdutosDados(produtos: Produto[]): Produto[] {
    return this.produtosDados.map((item, i) => {
      let produto = produtos.find((el) => el.id === Number(item.id));
      item.refId = i;
      return Object.assign(item, produto);
    });
  }

  get valorTotal(): string{
    let valor: number = 0;
    this.carrinhoTratados.forEach((item: Produto) => {
      valor += item.valor * item.quantidade;
    });

    return this.GlobalFunctions.valorConvertido(valor);
  }

  get quantidadeProdutos(): number{
    let quantidade: number = 0;
    this.carrinhoTratados.forEach((item: Produto) => {
      quantidade += item.quantidade;
    })
    return quantidade;
  }

  gerenciaLogin(){
    if (this.authService.isUsuarioLogado()) {
      this.authService.logout();

      this.GlobalFunctions.alerta('Logout Efetuado', 'Logout realizado com sucesso', 'success');

      setTimeout(() => {
        if(window.location.pathname === "/"){
          window.location.reload();
        }else{
          this.router.navigate(['/']);
        }
      }, 2000);
        

    }else{
      this.router.navigate(['/login']);
    }
  }

  saudacaoPersonalizada() {
    const agora = new Date();
    const hora = agora.getHours();

    if (hora >= 5 && hora < 12) {
        return "Bom dia";
    } else if (hora >= 12 && hora < 18) {
        return "Boa tarde";
    } else {
        return "Boa noite";
    }
}


  get isAdminArea(){
    if (typeof window !== "undefined") {
      return window.location.pathname.indexOf('admin') > -1;
    }else{
      return false;
   }
  }

  get isClienteArea(){
    if (typeof window !== "undefined") {
      return window.location.pathname.indexOf('cliente') > -1;
    }else{
      return false;
   }
  }

  get primeiroNome(): string{
    if (typeof window !== "undefined") {
      return this.authService.usuarioLogado ? this.authService.usuarioLogado.nome.split(' ')[0] : '';
    }

    return '';
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeStatusMenuInterno(){
    this.GlobalFunctions.showMenuInterno = !this.GlobalFunctions.showMenuInterno;
  }
}
