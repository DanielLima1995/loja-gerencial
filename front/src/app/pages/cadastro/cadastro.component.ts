import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioCadastrar } from '../../app.interface';
import { globalModules } from '../../globalModules';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
  imports: [...globalModules,
  ]
})
export class CadastroComponent {
  nome: string = '';
  cpf: string = '';
  email: string = '';
  senha: string = '';
  confirmSenha: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router){

  }

  // Função para alternar a visibilidade da senha
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Função de envio do formulário
  onSubmit(form: any): void {
    if (form.valid) {
      let infoUsuario: UsuarioCadastrar = {
        senha: this.senha,
        confirmSenha: this.confirmSenha,
        email:  this.email,
        cpf: this.cpf,
        nome: this.nome,
      }
      this.authService.cadastrarUsuario(infoUsuario)
      .subscribe({
        next: (response: any) => {
          console.log('Cadastro realizado com sucesso!', response);
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('Erro ao cadastrar usuário', err);
        }
      });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  get dadosValidados(){
      return true;
  }

  get senhaValida(){
    return  this.senhaPossuiMaiusculo && this.senhaPossuiMinusculo && this.senhaTamanho && this.confirmSenhaValidado;
  }

  get senhaPossuiMaiusculo(){
    return (/[A-Z]/.test(this.senha));
  }

  get senhaPossuiMinusculo(){
    return (/[a-z]/.test(this.senha));
  }

  get senhaTamanho(){
    return this.senha.length >= 8;
  }

  get confirmSenhaValidado(){
    return this.senha == this.confirmSenha;
  }

  
}
