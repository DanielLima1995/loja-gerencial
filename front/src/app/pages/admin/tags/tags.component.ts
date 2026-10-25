import { Component } from '@angular/core';

import { TagsService } from './tags.service';
import { mapTagsGroups, TagsGrupo, TagsWithKeys } from '../../../app.interface';
import { CarregamentoComponent } from '../../../components/carregamento/carregamento.component';
import { globalModules } from '../../../globalModules';
import { GlobalFunctions } from '../../../services/global.service';

@Component({
  selector: 'app-tags',
  imports: [
    ...globalModules,
    CarregamentoComponent

  ],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',

})
  export class TagsComponent {
    tags!: TagsWithKeys;
    carregando: boolean = false;

    constructor(private tagsService: TagsService, private globalFunctions: GlobalFunctions){

    }

    ngOnInit(){
      this.carregando = true;

      this.tagsService.getTags().subscribe(
        (response: TagsGrupo[]) => {
          this.carregando = false;

          this.tags = mapTagsGroups(response);
        },
        () => {
          this.globalFunctions.alertaDadosServidor();
        }
      );
    }
    
  }