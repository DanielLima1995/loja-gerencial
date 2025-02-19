import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
providedIn: 'root'
})

export class ProdutosCadastradosService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  

  constructor(
    private http: HttpClient
  ) {}

  getProdutos(page: number = 1, filtros: string = "") : Observable<any>{
    return this.http.get(`${this.apiUrl}/produtos?page=${page}${filtros ? '&' + filtros : ''}`);
  }

  getTags(cadastro:boolean = false) : Observable<any>{
    return this.http.get(`${this.apiUrl}/tags?filter[isCadastro]=${cadastro}`);
  }

  removeProduto(id:number){
    return this.http.delete(`${this.apiUrl}/produto/${id}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/