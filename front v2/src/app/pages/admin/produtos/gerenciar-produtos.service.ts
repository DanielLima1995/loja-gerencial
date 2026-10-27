import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Produto, ProdutoBody } from '../../../app.interface';

@Injectable({
  providedIn: 'root'
})

export class GerenciarProdutosService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend

  constructor(
    private http: HttpClient
  ) {}

  cadastrarProduto(dados: ProdutoBody) : Observable<unknown>{
    return this.http.post(`${this.apiUrl}/Produtos`, dados);
  }

  getProduto(id: number) : Observable<Produto>{
    return this.http.get<Produto>(`${this.apiUrl}/Produtos/${id}`);
  }

  editarProduto(id: number, body: ProdutoBody) : Observable<unknown>{
    return this.http.put(`${this.apiUrl}/Produtos/${id}`, body);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/