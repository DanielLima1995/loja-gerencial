
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EnderecoService } from './endereco.service';
import { globalModules } from '../../../globalModules';
import { Router } from '@angular/router';
import { GlobalFunctions } from '../../../services/global.service';
import { ToastComponent } from '../../../components/toast/toast.component';
import { ToastService } from '../../../components/toast/toast.service';

@Component({
  selector: 'app-endereco-cadastrar',
  imports: [...globalModules, ToastComponent
  ],
  templateUrl: './endereco-cadastrar.component.html',
})
export class EnderecoCadastrarComponent {
  enderecoForm: FormGroup;
  isCheckout: boolean = false;

  constructor(public toastService: ToastService ,private fb: FormBuilder, private enderecoService: EnderecoService, private router: Router, private globalFunctions: GlobalFunctions) {
    this.enderecoForm = this.fb.group({
      cep: ['', [Validators.required, Validators.minLength(8)]],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      pontoReferencia: [''],
    });
  }

  ngOnInit(): void {
    // Preencher o formulário com dados de exemplo
    this.enderecoForm.patchValue({
      cep: '',
      logradouro: '',
      bairro: '',
      cidade: '',
      uf: '',
      numero: '',
      complemento: '',
      pontoReferencia: '',
    });

    if (typeof window !== "undefined") {
      this.isCheckout = window.location.pathname.indexOf('checkout') > -1;
    }

  }

  onSubmit() {
    if (this.enderecoForm.valid) {
      const formData = this.enderecoForm.value;

      this.enderecoService.store(formData).subscribe(
          (res) => {
            if(this.isCheckout){
            this.globalFunctions.alerta('Endereço Cadastrado', 'O endereço foi cadastrado com sucesso.', 'success');
              this.router.navigate(['/checkout']);
            }else{
              this.toastService.show('Endereço cadastrado com sucesso!', 'success');
              this.router.navigate(['/cliente/enderecos']);
            }
          },
          () => {
            this.toastService.show('Erro ao cadastrar endereço', 'error');
          }
        );
    } else {
      this.toastService.show('Formulário inválido. Verifique os campos e tente novamente.', 'error');
      console.error('Formulário inválido');
    }
  }

  onBuscarCep() {
    let cep = this.enderecoForm.get('cep')?.value;
    cep = cep ? cep.replace(/\D/g, '') : ''; // Remove caracteres não numéricos

    if (cep && cep.length === 8) {
      this.toastService.show('Buscando endereço pelo CEP...', 'info');
      this.enderecoService.getEnderecoPorCep(cep).subscribe(
        (data) => {
          if (data.erro) {
            this.toastService.show('CEP não encontrado', 'error');
          } else {
            this.enderecoForm.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            });
          }
        },
        (error) => {
          console.error('Erro ao buscar CEP:', error);
        }
      );
    } else {
      console.error('CEP inválido');
    }
  }
}
