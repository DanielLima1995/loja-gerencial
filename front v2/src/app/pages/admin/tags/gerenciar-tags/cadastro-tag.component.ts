import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';


import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TagsService } from '../tags.service';
import { mapTagsGroups, TagsGrupo, TagsWithKeys } from '../../../../app.interface';
import { globalModules } from '../../../../globalModules';
import { GlobalFunctions } from '../../../../services/global.service';

@Component({
  selector: 'app-cadastro-tag',
  templateUrl: './cadastro-tag.component.html',
  styleUrls: ['./cadastro-tag.component.scss'],
  imports: [...globalModules,
    
    
  ]
})
export class CadastroTagComponent implements OnInit  {
  formulario: FormGroup;
  tags!: TagsWithKeys;

  constructor(private fb: FormBuilder, private tagsService: TagsService, private router: Router, private globalFunctions: GlobalFunctions){
    this.formulario = this.fb.group({
      tipo: ['', Validators.required], // Descrição é obrigatória
      descricao: ['', Validators.required], // Descrição básica é obrigatória
      cor: [''], // Produto Ativo, por padrão é false
    });
  }


    ngOnInit(){
      this.tagsService.getTags().subscribe(
        (response: TagsGrupo[]) => {
          this.tags = mapTagsGroups(response);
        },
        () => {
          this.globalFunctions.alertaDadosServidor();
        }
      );
    }

    sendCadastro(){
      if(!this.formulario.valid){
        this.globalFunctions.alerta('Erro ao Cadastrar Tag', 'Alguns dados do formulário estão inválidos. Por favor, revise as informações e tente novamente.', 'error')
      }

      

      this.tagsService.cadastrarTag(this.formulario.value).subscribe(
        () => {
          this.globalFunctions.alerta('Tag Cadastrada', 'A tag foi cadastrada com sucesso.', 'success')
          this.router.navigate(['/admin/tags']);
        },
        () => {
          this.globalFunctions.alerta('Erro ao Cadastrar Tag', 'Ocorreu uma falha ao tentar cadastrar a tag. Tente novamente.', 'error')
        }
      );
    }
}
