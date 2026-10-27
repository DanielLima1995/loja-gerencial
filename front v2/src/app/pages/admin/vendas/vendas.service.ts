import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse, Vendas, VendaStatusInput } from '../../../app.interface';

@Injectable({
providedIn: 'root'
})

export class VendasService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  

  constructor(
    private http: HttpClient
  ) {}

  getVendas(page: number = 1) : Observable<PaginatedResponse<Vendas>>{
    return this.http.get<PaginatedResponse<Vendas>>(`${this.apiUrl}/Vendas`, {
      headers: {
        'X-Page-Number': String(page),
        'X-Page-Size': '15',
      },
    });
  }

  alteraStatusVenda(id:number, status:string) : Observable<unknown>{
    return this.http.put(`${this.apiUrl}/Vendas/${id}`, {
      status: status
    } satisfies VendaStatusInput);
  }

  getVenda(id:number) : Observable<Vendas>{
    return this.http.get<Vendas>(`${this.apiUrl}/Vendas/${id}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/