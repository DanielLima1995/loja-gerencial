
import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../pages/cart/cart.service';
import { CarrinhoProdutoInput, Menu, Produto } from '../../app.interface';
import { globalModules } from '../../globalModules';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GlobalFunctions } from '../../services/global.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  produtosDados: CarrinhoProdutoInput[] = [];

  isLogado = false;
  private subscription!: Subscription;
  environment = environment;
  dropdownActions: any = [];
  
  constructor(
    public service: CartService,
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
          this.service.carrinhoTratados = this.service.trataProdutosCarrinho(response.produtos ?? []);
        },
        () => {
          this.GlobalFunctions.alertaDadosServidor();
        }
      );
    }else{
      if(typeof window !== 'undefined' && localStorage.getItem('carrinho')){
        this.produtosDados = JSON.parse(localStorage.getItem('carrinho') ?? "[]"); 
        let ids = this.produtosDados.map((item) => item.produtoId);

        this.service.getProdutosDados(ids).subscribe(
          (response) => {
            this.service.carrinhoTratados = this.trataProdutosDados(response);
          },
          () => {
            this.GlobalFunctions.alertaDadosServidor();
          }
        );
      }
    }
  }

  

  trataProdutosDados(produtos: Produto[]): Produto[] {
    return this.produtosDados.map((item, i) => {
      const produto = produtos.find((el) => el.id === Number(item.produtoId));
      return Object.assign({}, produto, {
        quantidade: item.quantidade,
        corId: item.corId,
        tamanhoId: item.tamanhoId,
        generoId: item.generoId,
        refId: i,
      }) as Produto;
    });
  }

  get valorTotal(): string{
    let valor: number = 0;
    this.service.carrinhoTratados.forEach((item: Produto) => {
      valor += item.valor * (item.quantidade ?? 0);
    });

    return this.GlobalFunctions.valorConvertido(valor);
  }

  get quantidadeProdutos(): number{
    let quantidade: number = 0;
    this.service.carrinhoTratados.forEach((item: Produto) => {
      quantidade += item.quantidade ?? 0;
    })
    return quantidade;
  }

  gerenciaLogin(){
    if (this.authService.isUsuarioLogado()) {
      this.authService.logout();

      this.GlobalFunctions.alerta('Logout Efetuado', 'Logout realizado com sucesso', 'success');

      setTimeout(() => {
        if(window.location.pathname === this.environment.baselocal || window.location.pathname === this.environment.baseprod){
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

  dropdownMenuManipulator(action: number, index: string){
    if(!this.dropdownActions){
      this.dropdownActions = [];
    } 
    
    this.dropdownActions[index] = action; 
  }
}
