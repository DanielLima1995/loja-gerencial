import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
providedIn: 'root'
})

export class TagsService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  

  constructor(
    private http: HttpClient
  ) {}

  getTags() : Observable<any>{
    return this.http.get(`${this.apiUrl}/tags`);
  }

  cadastrarTag(body: any) : Observable<any>{
    return this.http.post(`${this.apiUrl}/tag`, body);
  }

  editarTag(id:number, body: any) : Observable<any>{
    return this.http.post(`${this.apiUrl}/tag/${id}`, body);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/