import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { globalModules } from '../../globalModules';
import Swal from 'sweetalert2';
import { ProductDetailsService } from '../product-details/product-details.service';
import { GlobalFunctions } from '../../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [...globalModules]
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  isCheckout: boolean = false;
  carregando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private produtosService: ProductDetailsService,
    private globalFunctions: GlobalFunctions
  ){
    
  }

  ngOnInit(){
    
    if (typeof window !== "undefined") {
      this.authService.logout();
      this.isCheckout = window.location.pathname.indexOf('checkout') > -1;
    }
  }

  // Função para alternar a visibilidade da senha
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Função de envio do formulário
  onLogin(form: any): void {
    if(!form.valid) return;
    this.carregando = true;
    this.authService.login(this.email, this.senha).subscribe({
      next:(authData) => {
        if (
          !authData.email ||
          !authData.nomeUsuario ||
          !['Admin', 'Cliente'].includes(authData.tipoUsuario) ||
          !authData.token ||
          !authData.dataExpiracaoToken
        ) {
          this.carregando = false;
          this.globalFunctions.alerta('Resposta Inválida', 'A API não retornou os dados esperados para iniciar a sessão.', 'error');
          return;
        }

        this.authService.saveUser({
          email: authData.email,
          nome: authData.nomeUsuario,
          tipoUsuario: authData.tipoUsuario,
        });
        this.authService.saveToken(authData.token, authData.dataExpiracaoToken);
        // Redirecionar o usuário para uma página protegida (exemplo: página inicial)


        const carrinhoLocal = typeof window !== 'undefined'
          ? localStorage.getItem('carrinho')
          : null;
        const produtosDados = carrinhoLocal ? JSON.parse(carrinhoLocal) : [];
        if (produtosDados.length > 0) {
          this.produtosService.gerenciarCarrinho(produtosDados).subscribe({
            next: () => {
              localStorage.removeItem('carrinho');
              this.afterLogin();
            },
            error: () => {
              this.authService.logout();
              this.carregando = false;
              this.globalFunctions.alerta('Erro ao Sincronizar Carrinho', 'A sessão não foi iniciada porque não foi possível transferir o carrinho para sua conta. Tente novamente.', 'error');
            },
          });
        } else {
          this.afterLogin();
        }

        
      },
      error: () => {
        this.carregando = false;
        this.globalFunctions.alerta('Erro de Login', 'O email ou senha inseridos estão incorretos. Verifique suas credenciais e tente novamente.', 'error');
      }
    });
  }

  afterLogin(){
    this.carregando = false;
    this.authService.updateUsuarioLogado();
    this.globalFunctions.gerenciaMenuExterno(this.authService.tipoUsuario);

    if(this.isCheckout){
      this.router.navigate(['/checkout']);
    }else{
      this.router.navigate(['/']);
    }
  }
}
