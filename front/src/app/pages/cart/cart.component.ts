import { Component, Input } from '@angular/core';
import { CartService } from './cart.service';



import { InputNumericoComponent } from '../../components/input-numerico/input-numerico.component';
import { AuthService } from '../../services/auth.service';
import { SelectCoresComponent } from '../../components/select-cores/select-cores.component';
import Swal from 'sweetalert2';
import { SelectTamanhosComponent } from '../../components/select-tamanhos/select-tamanhos.component';
import { Carrinho, CarrinhoProdutos, ItemExclusaoRef, Produto, TagsProdutos, TagsTratadas } from '../../app.interface';
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
  carrinhoProdutos: Carrinho[] = [];
  produtosDados: Array<CarrinhoProdutos> = [];
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
        (response: { data: { carrinhoProdutos: CarrinhoProdutos[] } }) => {
          this.service.carrinhoTratados = this.trataProdutosCarrinho(response?.data?.carrinhoProdutos);
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
        let ids = this.produtosDados.map((item) => item.id);

        this.service.getProdutosDados(ids).subscribe(
          (response: { data: Produto[] }) => {
            this.service.carrinhoTratados = this.trataProdutosDados(response.data);
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
      let filtrados = element.tagsProdutos?.filter(
        (item: TagsProdutos) => item.tags.tipo === 'Cores'
      ) || [];

      this.coresDisponiveis[element.id] = filtrados.map((item: TagsProdutos) => ({
        id: item.tags.id,
        descricao: item.tags.descricao,
        cor: item.tags.cor,
        tipo: item.tags.tipo,
      }));

      this.gerTamanhosDisponiveis();
    });
  }

  gerTamanhosDisponiveis() {
     this.service.carrinhoTratados.forEach((element: Produto) => {
      let filtrados = element.tagsProdutos?.filter(
        (item: TagsProdutos) => item.tags.tipo === 'Tamanho'
      ) || [];

      this.tamanhosDisponiveis[element.id] = filtrados.map((item: TagsProdutos): TagsTratadas => ({
        id: item.tags.id,
        descricao: item.tags.descricao,
        cor: item.tags.cor,
        tipo: item.tags.tipo,
        tamanho: item.tags.tamanho,
      })) as TagsTratadas[];
    });

    this.carregando = false;
  }

  trataProdutosDados(produtos: Produto[]): Produto[] {
    return this.produtosDados.map((item, i) => {
      let produto = produtos.find((el) => el.id === Number(item.id));
      item.refId = i + 1;
      return Object.assign(item, produto);
    });
  }

  trataProdutosCarrinho(produtos: CarrinhoProdutos[]): Produto[] {
    if(!produtos || produtos.length === 0) return [];

    return produtos.map((item) => {
      item.produto!.cor = item.cor;
      item.produto!.quantidade = item.quantidade;
      item.produto!.refId = item.id;
      item.produto!.tamanho = item.tamanho;

      return item.produto!;
    });
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
          this.service.removeItemCarrinho(id).subscribe();
          this.toast.show('Produto removido com sucesso!', 'success');
          this.carregando = true;
          this.service.getProdutos().subscribe(
            (response: { data: { carrinhoProdutos: CarrinhoProdutos[] } }) => {
               this.service.carrinhoTratados = this.trataProdutosCarrinho(response?.data?.carrinhoProdutos);
            }
          );
        } else {
          let produtosAtuais: Array<CarrinhoProdutos> = JSON.parse(localStorage.getItem('carrinho') ?? "[]");

          let novosProdutos = produtosAtuais.filter((item, indice: number) => indice !== id);

          localStorage.setItem('carrinho', JSON.stringify(novosProdutos));
        }

        this.init();
      }
    });
  }

  atualizaProduto(ref: string, indice: number, event: any, id: number = 0) {

    if (this.authService.getToken()) {
      let dados = {
        ref: ref,
        indice: indice,
        id: id,
        valor: event.id ?? event,
      };

      this.service.atualizaProduto(dados).subscribe(
        (response: any) => {
          console.log(response);
        },
        () => {
          this.globalFunctions.alerta('Falha ao Atualizar Produto', 'Falha ao atualizar o produto no carrinho. Tente novamente mais tarde.', 'success');
        }
      );
    } else {
     // this.carrinhoTratados[indice][ref] = event.id ?? event;
      localStorage.setItem('carrinho', JSON.stringify( this.service.carrinhoTratados));
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
