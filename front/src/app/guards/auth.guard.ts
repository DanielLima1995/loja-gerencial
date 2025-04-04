import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { GlobalFunctions } from '../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,  private globalFunctions: GlobalFunctions) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url = route.url.map(segment => segment.path).join('/');

    // Retorna um Observable que aguarda os dados do usuário
    return this.authService.getInfoUsuario().pipe(
      map((res) => {
        const usuario = res?.data;

        if (usuario) {
          if (url.startsWith('admin') && usuario.tipo_usuario.descricao === 'Admin') {
            return true;
          }
          if (url.startsWith('cliente') && usuario.tipo_usuario.descricao === 'Cliente') {
            return true;
          }
        }

        // Redireciona caso o usuário não tenha permissão

        this.globalFunctions.alerta('Acesso Negado', 'Você não possui permissão para acessar esta página. Redirecionando para a página inicial.','error');
        this.authService.logout();
    
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
    
            return false;
      })
    );
  }
}


