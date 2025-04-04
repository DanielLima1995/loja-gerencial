import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EnderecoService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend

  constructor(private http: HttpClient) {}

  store(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/endereco`, data);
  }

  index(): Observable<any> {
    return this.http.get(`${this.apiUrl}/enderecos`);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/endereco/${id}`, data);
  }

  show(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/endereco/${id}`);
  }

  getEnderecoPorCep(cep: string): Observable<any> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get(url);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/