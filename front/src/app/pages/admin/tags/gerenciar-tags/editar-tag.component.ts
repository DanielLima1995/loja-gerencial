import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsService } from '../tags.service';
import { TagsWithKeys, Tag } from '../../../../app.interface';
import { CarregamentoComponent } from '../../../../components/carregamento/carregamento.component';
import { globalModules } from '../../../../globalModules';
import { GlobalFunctions } from '../../../../services/global.service';

@Component({
  selector: 'app-editar-tag',
  templateUrl: './editar-tag.component.html',
  styleUrls: ['./editar-tag.component.scss'],
  imports: [
    ...globalModules,
    CarregamentoComponent
  ]
})
export class EditarTagComponent implements OnInit  {
  formulario: FormGroup;
  tags!: TagsWithKeys;
  tagId: number;
  carregando: boolean = false;


  constructor(private fb: FormBuilder, private tagsService: TagsService, private router: Router, private route: ActivatedRoute, private globalFunctions: GlobalFunctions){
    this.formulario = this.fb.group({
      tipo: ['', Validators.required], // Descrição é obrigatória
      descricao: ['', Validators.required], // Descrição básica é obrigatória
      cor: [''], // Produto Ativo, por padrão é false
    });

    this.tagId = this.route.snapshot.params['id'];

  }


    ngOnInit(){
      this.carregando = true;

      this.tagsService.getTags().subscribe(
        (response) => {
          this.tags = response;
          this.carregando = false;

          Object.keys(this.tags.dados).map((e) => {
            this.tags.dados[e].forEach(
              (item: Tag) => {
                if(item.id == this.tagId){
                  this.formulario.patchValue({
                    tipo: e,
                    cor: item.cor,
                    descricao: item.tipo
                  })
                }
              }
            )
          });
          
        }
        ,
        () => {
          this.globalFunctions.alertaDadosServidor();
        });
    }

    sendEdicao(){
      if(!this.formulario.valid){
        this.globalFunctions.alerta('Erro ao editar Tag', 'Alguns dados do formulário estão inválidos. Por favor, revise as informações e tente novamente.', 'error')
      }

      

      this.tagsService.editarTag(this.tagId, this.formulario.value).subscribe(
        () => {
          this.globalFunctions.alerta('Tag Editada', 'Tag editada com Sucesso', 'success')
          this.router.navigate(['/admin/tags']);
        },
        () => {
          this.globalFunctions.alerta('Erro ao Editar Tag', 'Ocorreu uma falha ao tentar editar a tag. Tente novamente.', 'error')
        }
      );
    }
}
