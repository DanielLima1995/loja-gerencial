import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProdutoFilter, TagsFilter, TagsGrupo } from '../../app.interface';

@Injectable({
providedIn: 'root'
})

export class ProductListService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  

  constructor(
    private http: HttpClient
  ) {}

  getProdutos(page: number = 1, filtros: Partial<ProdutoFilter> = {}, pageSize: number = 15) {
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

  getTags(cadastro: boolean = false) {
    const params: Partial<TagsFilter> = { isCadastro: cadastro };
    return this.http.get<TagsGrupo[]>(`${this.apiUrl}/Tags`, {
      params: { isCadastro: String(params.isCadastro) },
    });
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/