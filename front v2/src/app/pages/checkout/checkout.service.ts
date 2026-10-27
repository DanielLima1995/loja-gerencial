
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VendaInput } from '../../app.interface';

@Injectable({
  providedIn: 'root'
})

export class CheckoutService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend

  constructor(
        private http: HttpClient
  ) {}

  finalizaCompra(data: VendaInput): Observable<unknown>{
    return this.http.post(`${this.apiUrl}/Vendas`, data);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/