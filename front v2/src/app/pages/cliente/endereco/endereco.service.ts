import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Endereco, EnderecoInput, ViaCepResponse } from '../../../app.interface';

@Injectable({
  providedIn: 'root'
})

export class EnderecoService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend

  constructor(private http: HttpClient) {}

  store(data: EnderecoInput): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/ClienteEnderecos`, data);
  }

  index(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`${this.apiUrl}/ClienteEnderecos`);
  }

  show(id: number): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.apiUrl}/ClienteEnderecos/${id}`);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/ClienteEnderecos/${id}`);
  }

  getEnderecoPorCep(cep: string): Observable<ViaCepResponse> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get<ViaCepResponse>(url);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/