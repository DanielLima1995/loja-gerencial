
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EnderecoService } from './endereco.service';
import { ActivatedRoute, Router } from '@angular/router';
import { globalModules } from '../../../globalModules';
import { CarregamentoComponent } from '../../../components/carregamento/carregamento.component';
import Swal from 'sweetalert2';
import { GlobalFunctions } from '../../../services/global.service';
import { ToastComponent } from '../../../components/toast/toast.component';
import { ToastService } from '../../../components/toast/toast.service';

@Component({
  selector: 'app-editar-endereco',
  imports: [...globalModules,
    CarregamentoComponent
    
  ],
  templateUrl: './editar-endereco.component.html',
})
export class EditarEnderecoComponent {
  enderecoForm: FormGroup;
  idEndereco: number = 0;
  carregando = true;
  isCheckout: boolean = false;

  constructor(public toast: ToastService, private fb: FormBuilder, private enderecoService: EnderecoService,  private route: ActivatedRoute,  private router: Router, private globalFunctions: GlobalFunctions) {
    this.enderecoForm = this.fb.group({
      cep: ['', [Validators.required, Validators.minLength(8)]],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      localidade: ['', Validators.required],
      uf: ['', Validators.required],
      estado: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      ponto_referencia: [''],
    });

    this.idEndereco = this.route.snapshot.params['id'];

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.carregarEndereco(this.idEndereco);

      }

      if (typeof window !== "undefined") {
        this.isCheckout = window.location.pathname.indexOf('checkout') > -1;
      }
    });
  }

  carregarEndereco(id: number) {
    this.enderecoService.show(id).subscribe(
      (data) => {
        this.enderecoForm.patchValue({
          cep: data.cep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          estado: data.estado,
          numero: data.numero,
          complemento: data.complemento,
          ponto_referencia: data.ponto_referencia,
        });

        this.carregando = false;

      },
      (error) => {
          this.globalFunctions.alertaDadosServidor();
      }
    );
  }

  onSubmit() {
    if (this.enderecoForm.valid) {
      const formData = this.enderecoForm.value;
      this.enderecoService.update(this.idEndereco, formData).subscribe(
        (res) => {
        this.globalFunctions.alerta('Endereço Atualizado', 'O endereço foi atualizado com sucesso.', 'success');
        this.gerAfterRouter();
        },
        () => {
        this.toast.show('Erro ao atualizar endereço', 'error');
        }
      );
      
    } else {
      this.toast.show('Alguns dados do formulário estão inválidos. Por favor, revise as informações e tente novamente.', 'error');
    }
  }

  onBuscarCep() {
    const cep = this.enderecoForm.get('cep')?.value;


    let cepReplace = cep.replaceAll('-','');

    if (cepReplace && cepReplace.length === 8) {
      this.toast.show('Buscando CEP...', 'info');
      this.enderecoService.getEnderecoPorCep(cepReplace).subscribe(
        (data) => {
          if (data.erro) {
            this.toast.show('CEP Inválido', 'error');
          } else {
            this.toast.show('CEP Encontrado', 'success');
            this.enderecoForm.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              localidade: data.localidade,
              uf: data.uf,
              estado: data.uf, // ou mapeie para outro formato de estado, se necessário
            });
          }
        },
        (error) => {
          this.toast.show('Erro ao buscar CEP', 'error');
          console.error('Erro ao buscar CEP:', error);
        }
      );
    } else {
      this.toast.show('CEP Inválido', 'error');
    }
  }

  gerAfterRouter(){
    setTimeout(() => {
      if(this.isCheckout){
        this.router.navigate(['/checkout']);
      }else{
        this.router.navigate(['/cliente/enderecos']);
      }    
    }, 2000);
  }
}
