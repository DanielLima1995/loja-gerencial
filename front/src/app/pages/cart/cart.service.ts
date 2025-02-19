import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend

  constructor(
    private http: HttpClient
  ) {}

  getProdutos() : Observable<any>{
    return this.http.get(`${this.apiUrl}/carrinho`);
  }

  getProdutosDados(ids: Array<number>) : Observable<any>{
    return this.http.get(`${this.apiUrl}/carrinho/produtos/dados?produtos=${ids}`);
  }

  removeItemCarrinho(id:number){
    return this.http.delete(`${this.apiUrl}/carrinho/excluir/produto/${id}`);
  }
  
  atualizaProduto(data: any){
    return this.http.post(`${this.apiUrl}/carrinho/editar/produto`, data);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/