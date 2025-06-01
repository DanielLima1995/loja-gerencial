import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioCadastrar } from '../../app.interface';
import { globalModules } from '../../globalModules';
import { GlobalFunctions } from '../../services/global.service';

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
  carregando: boolean = false;

  constructor(private authService: AuthService, private router: Router, public GlobalFunctions: GlobalFunctions  ){

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
      };

      this.carregando = true;
      this.authService.cadastrarUsuario(infoUsuario)
      .subscribe({
        next: (response: any) => {
          this.carregando = false;
          this.GlobalFunctions.alerta('Cadastro realizado com sucesso','Usuário cadastrado com sucesso','success');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (err: any) => {
          this.GlobalFunctions.alerta('Erro no Servidor','Ocorreu um erro no servidor ao tentar cadastrar o cliente. Por favor, tente novamente mais tarde.','error');
          console.error('Erro ao cadastrar usuário', err);
          this.carregando = false;

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
