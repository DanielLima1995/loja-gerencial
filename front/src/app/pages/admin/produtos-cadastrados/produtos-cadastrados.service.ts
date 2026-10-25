import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProdutoFilter } from '../../../app.interface';

@Injectable({
providedIn: 'root'
})

export class ProdutosCadastradosService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  

  constructor(
    private http: HttpClient
  ) {}

  getProdutos(page: number = 1, filtros: Partial<ProdutoFilter> = {}, pageSize: number = 15) : Observable<any>{
    let params = new HttpParams()
      .set('page', page)
      .set('perPage', pageSize);

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<any>(`${this.apiUrl}/Produtos`, { params });
  }

  getTags(cadastro:boolean = false) : Observable<any>{
    return this.http.get(`${this.apiUrl}/Tags?isCadastro=${cadastro}`);
  }

  removeProduto(id:number){
    return this.http.delete(`${this.apiUrl}/Produtos/${id}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/