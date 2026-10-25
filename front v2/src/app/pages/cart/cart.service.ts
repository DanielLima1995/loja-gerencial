import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Carrinho, CarrinhoProduto, Produto, setImagemPrincipal } from '../../app.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}`;
  public carrinhoTratados: Produto[] = [];
  public carrinho?: Carrinho;

  constructor(private http: HttpClient) {}

  trataProdutosCarrinho(produtos: CarrinhoProduto[]): Produto[] {
    if (!produtos || produtos.length === 0) return [];

    return produtos.map((item) => setImagemPrincipal({
      ...item.produto,
      corId: item.corId,
      generoId: item.generoId,
      tamanhoId: item.tamanhoId,
      quantidade: item.quantidade,
      refId: item.id,
      tamanhoDescricao: item.tamanho?.descricao,
      tagDescricao: item.cor?.descricao,
    }));
  }

  getProdutos(): Observable<Carrinho> {
    return this.http.get<Carrinho>(`${this.apiUrl}/Carrinho`).pipe(
      tap((carrinho) => this.carrinho = carrinho)
    );
  }

  getProdutosDados(ids: number[]): Observable<Produto[]> {
    let params = new HttpParams();
    ids.forEach((id) => params = params.append('produtosIds', id));
    return this.http.get<Produto[]>(`${this.apiUrl}/Produtos/produtosSemLogin`, { params }).pipe(
      map((produtos) => produtos.map(setImagemPrincipal))
    );
  }

  removeItemCarrinho(id: number) {
    return this.http.delete(`${this.apiUrl}/Carrinho/${id}`);
  }

  atualizaProduto(
    produtos: Pick<CarrinhoProduto, 'produtoId' | 'tamanhoId' | 'quantidade' | 'generoId' | 'corId'>[]
  ) {
    if (!this.carrinho) {
      throw new Error('Não há carrinho carregado para atualizar.');
    }
    return this.http.put(`${this.apiUrl}/Carrinho/${this.carrinho.id}`, produtos);
  }
}
