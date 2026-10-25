import { Component, Input } from '@angular/core';
import { CartService } from './cart.service';



import { InputNumericoComponent } from '../../components/input-numerico/input-numerico.component';
import { AuthService } from '../../services/auth.service';
import { SelectCoresComponent } from '../../components/select-cores/select-cores.component';
import Swal from 'sweetalert2';
import { SelectTamanhosComponent } from '../../components/select-tamanhos/select-tamanhos.component';
import { CarrinhoProduto, CarrinhoProdutoInput, ItemExclusaoRef, Produto, TagsTratadas } from '../../app.interface';
import { globalModules } from '../../globalModules';
import { Router } from '@angular/router';
import { CarregamentoComponent } from '../../components/carregamento/carregamento.component';
import { GlobalFunctions } from '../../services/global.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { ToastService } from '../../components/toast/toast.service';


@Component({
  selector: 'app-cart',
  imports:[
    ...globalModules,
    
    InputNumericoComponent,
    SelectCoresComponent,
    SelectTamanhosComponent,
    CarregamentoComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  @Input() checkout: boolean = false;
  produtosDados: CarrinhoProdutoInput[] = [];
  coresDisponiveis: Array<TagsTratadas>[] = [];
  itemExclusao: ItemExclusaoRef = {
    id: 0,
    cor: 0
  };
  selectedTamanho: number = 0;
  tamanhosDisponiveis: Array<TagsTratadas>[] = [];
  carregando = false;
  isMobile: boolean = false;


  constructor(
    public service: CartService,
    private authService: AuthService,
    private router: Router,
    public globalFunctions: GlobalFunctions,
    public toast: ToastService
  ) {}

  ngOnInit() {
    if (typeof window !== "undefined") {
      let l = window.screen.width;
      this.isMobile = (l < 900);
      this.init();
    }
  }

  init() {
    if (this.authService.getToken()) {
      this.carregando = true;
      this.service.getProdutos().subscribe(
        (response) => {
          this.service.carrinhoTratados = this.trataProdutosCarrinho(response.produtos ?? []);
          this.gerCoresDisponiveis();
          this.carregando = false;
        },
        () => {
          this.globalFunctions.alertaDadosServidor();
        }
      );
    } else {
      if (typeof window !== 'undefined' && localStorage.getItem('carrinho')) {
        this.produtosDados = JSON.parse(localStorage.getItem('carrinho') ?? "[]");
        let ids = this.produtosDados.map((item) => item.produtoId);

        this.service.getProdutosDados(ids).subscribe(
          (response: Produto[]) => {
            this.service.carrinhoTratados = this.trataProdutosDados(response);
            this.gerCoresDisponiveis();
            //localStorage.removeItem('carrinho');
          },
          () => {
            this.globalFunctions.alertaDadosServidor();
          }
        );
      }
    }
  }

  gerCoresDisponiveis() {
     this.service.carrinhoTratados.forEach((element: Produto) => {
      this.coresDisponiveis[element.id] = (element.tags ?? [])
        .filter((tag) => tag.tipo.toLowerCase() === 'cores');

      this.gerTamanhosDisponiveis();
    });
  }

  gerTamanhosDisponiveis() {
     this.service.carrinhoTratados.forEach((element: Produto) => {
      this.tamanhosDisponiveis[element.id] = (element.tags ?? [])
        .filter((tag) => tag.tipo.toLowerCase() === 'tamanho');
    });

    this.carregando = false;
  }

  trataProdutosDados(produtos: Produto[]): Produto[] {
    return this.produtosDados.map((item, i) => {
      let produto = produtos.find((el) => el.id === Number(item.produtoId));
      item.refId = i + 1;
      return Object.assign({}, produto, {
        quantidade: item.quantidade,
        corId: item.corId,
        tamanhoId: item.tamanhoId,
        generoId: item.generoId,
        refId: item.refId,
      }) as Produto;
    });
  }

  trataProdutosCarrinho(produtos: CarrinhoProduto[]): Produto[] {
    if(!produtos || produtos.length === 0) return [];
    return this.service.trataProdutosCarrinho(produtos);
  }

  alteraCor() {

  }

  excluirProdutos(id?: number) {
    if(!id) return;
    Swal.fire({
      title: "Excluir Produto?",
      text: "Você realmente deseja excluir produto do carrinho?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.authService.getToken()) {
          this.service.removeItemCarrinho(id).subscribe({
            next: () => {
              this.toast.show('Produto removido com sucesso!', 'success');
              this.init();
            },
            error: () => this.globalFunctions.alerta('Erro ao Remover Produto', 'Não foi possível remover o produto do carrinho.', 'error'),
          });
          return;
        } else {
          let produtosAtuais: CarrinhoProdutoInput[] = JSON.parse(localStorage.getItem('carrinho') ?? "[]");

          let novosProdutos = produtosAtuais.filter((item, indice) => indice + 1 !== id);

          localStorage.setItem('carrinho', JSON.stringify(novosProdutos));
        }

        this.init();
      }
    });
  }

  atualizaProduto(ref: string, indice: number, event: any, id: number = 0) {

    if (this.authService.getToken()) {
      const carrinho = this.service.carrinho;
      if (!carrinho) return;
      const produtos = carrinho.produtos.map((item) => {
        const produto: CarrinhoProdutoInput = {
          produtoId: item.produtoId,
          tamanhoId: item.tamanhoId,
          quantidade: item.quantidade,
          generoId: item.generoId,
          corId: item.corId,
        };
        if (item.id === id) {
          if (ref === 'quantidade') produto.quantidade = event.id ?? event;
          if (ref === 'tamanho') produto.tamanhoId = event.id ?? event;
          if (ref === 'cor') produto.corId = event.id ?? event;
        }
        return produto;
      });

      this.service.atualizaProduto(produtos).subscribe({
        error: () => this.globalFunctions.alerta('Falha ao Atualizar Produto', 'Falha ao atualizar o produto no carrinho. Tente novamente mais tarde.', 'error'),
      });
    } else {
      const produto = this.service.carrinhoTratados[indice];
      if (ref === 'quantidade') produto.quantidade = event.id ?? event;
      if (ref === 'tamanho') produto.tamanhoId = event.id ?? event;
      if (ref === 'cor') produto.corId = event.id ?? event;
      localStorage.setItem('carrinho', JSON.stringify(this.service.carrinhoTratados.map((item) => ({
        produtoId: item.id,
        tamanhoId: item.tamanhoId ?? 0,
        quantidade: item.quantidade ?? 0,
        generoId: item.generoId ?? 0,
        corId: item.corId ?? 0,
        refId: item.refId,
      }))));
    }
  }

  get quantidadeProdutos(): number {
    let quantidade: number = 0;
     this.service.carrinhoTratados.forEach((item) => {
      quantidade += item.quantidade!;
    });
    return quantidade;
  }

  get valorTotal(): string {
    let valor: number = 0;
     this.service.carrinhoTratados.forEach((item) => {
      valor += item.valor ? (parseFloat(item.valor.toString()) * item.quantidade) : 0;
    });

    return this.globalFunctions.valorConvertido(valor);
  }

  alteraTamanho(e: number) {
    this.selectedTamanho = e;
  }

  finalizarCompra(){
    if (this.authService.getToken()) {
      this.router.navigate(['/checkout']);
    }else{
      this.modalRedirect();
    }
  }

  modalRedirect(){
      Swal.fire({
        title: "Login Necessário",
        text: "É necessário realizar o login antes de finalizar a compra",
        icon: "info",
        showCancelButton: false,
        confirmButtonColor: "#0d6efd",
        confirmButtonText: "Realizar Login",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login/checkout']);
        }
      });
    }

}
