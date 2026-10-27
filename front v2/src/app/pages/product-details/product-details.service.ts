import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CarrinhoProdutoInput, Produto } from '../../app.interface';

@Injectable({
  providedIn: 'root'
})

export class ProductDetailsService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  constructor(
    private http: HttpClient,
  ) {
    
  }

  getProduto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/Produtos/${id}`);
  }

  gerenciarCarrinho(produtos: CarrinhoProdutoInput[]): Observable<unknown> {
    const requestProdutos = produtos.map(({ produtoId, tamanhoId, quantidade, generoId, corId }) => ({
      produtoId,
      tamanhoId,
      quantidade,
      generoId,
      corId,
    }));
    return this.http.post(`${this.apiUrl}/Carrinho`, { produtos: requestProdutos });
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/