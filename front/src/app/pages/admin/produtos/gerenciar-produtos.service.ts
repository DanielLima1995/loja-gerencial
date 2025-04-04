import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProdutoBody } from '../../../app.interface';

@Injectable({
  providedIn: 'root'
})

export class GerenciarProdutosService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend

  constructor(
    private http: HttpClient
  ) {}

  cadastrarProduto(dados: ProdutoBody) : Observable<any>{
    return this.http.post(`${this.apiUrl}/produto`, dados);
  }

  getProduto(id: number) : Observable<any>{
    return this.http.get(`${this.apiUrl}/produto/detalhes/${id}`);
  }

  editarProduto(id: number, body: ProdutoBody) : Observable<any>{
    return this.http.post(`${this.apiUrl}/produto/${id}`, body);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/