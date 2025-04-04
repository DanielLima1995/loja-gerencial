import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
providedIn: 'root'
})

export class VendasService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  

  constructor(
    private http: HttpClient
  ) {}

  getVendas(page: number = 1) : Observable<any>{
    return this.http.get(`${this.apiUrl}/vendas?page=${page}`);
  }

  alteraStatusVenda(id:number, status:string) : Observable<any>{
    return this.http.post(`${this.apiUrl}/venda/${id}/status`, {
      status: status
    });
  }

  getVenda(id:number) : Observable<any>{
    return this.http.get(`${this.apiUrl}/venda/${id}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/