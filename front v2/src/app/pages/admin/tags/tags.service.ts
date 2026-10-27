import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TagInput, TagsGrupo } from '../../../app.interface';

@Injectable({
providedIn: 'root'
})

export class TagsService {
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  

  constructor(
    private http: HttpClient
  ) {}

  getTags() : Observable<TagsGrupo[]>{
    return this.http.get<TagsGrupo[]>(`${this.apiUrl}/Tags`);
  }

  cadastrarTag(body: TagInput) : Observable<unknown>{
    return this.http.post(`${this.apiUrl}/Tags`, body);
  }

  removerTag(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/Tags/${id}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/