import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Produto } from '../../app.interface';

@Injectable({
  providedIn: 'root'
})

export class ProdutosRelacionadosService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend

  constructor(
    private http: HttpClient
  ) {}

  getProdutosRelacionados(idProduto?: number): Observable<Produto[]> {
    const params = idProduto == null ? {} : { id: idProduto };
    return this.http.get<Produto[]>(`${this.apiUrl}/Produtos/produtosRelacionados`, { params });
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/