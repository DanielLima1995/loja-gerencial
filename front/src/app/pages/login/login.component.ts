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
      next:(response: any) => {
        this.carregando = false;
        
        this.authService.usuarioLogado = response.data.usuario;
        this.authService.saveToken(response.data.token, response.data.expires_at);
        // Redirecionar o usuário para uma página protegida (exemplo: página inicial)


        if (typeof window !== 'undefined' && localStorage.getItem('carrinho')) {
          let produtosDados = JSON.parse(localStorage.getItem('carrinho') ?? "[]");
          if(produtosDados){
            this.produtosService.gerenciarCarrinho(produtosDados).subscribe(
              () => {
                this.afterLogin();
                return;
              }
            );
          }
          this.globalFunctions.gerenciaMenuExterno(this.authService.usuarioLogado.tipo_usuario.descricao);
          this.afterLogin();
        }else{
          this.authService.updateUsuarioLogado();
          this.globalFunctions.gerenciaMenuExterno(this.authService.usuarioLogado.tipo_usuario.descricao);

          if(this.isCheckout){
            this.router.navigate(['/checkout']);
          }else{
            this.router.navigate(['/']);
          }
        }

        
      },
      error: () => {
        this.carregando = false;
        this.globalFunctions.alerta('Erro de Login', 'O email ou senha inseridos estão incorretos. Verifique suas credenciais e tente novamente.', 'error');
      }
    });
  }

  afterLogin(){
    this.authService.updateUsuarioLogado();

    if(this.isCheckout){
      this.router.navigate(['/checkout']);
    }else{
      this.router.navigate(['/']);
    }
  }
}
