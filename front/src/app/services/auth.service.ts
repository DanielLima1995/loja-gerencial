import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.js';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient
  
 } from '@angular/common/http';
import { Usuario, UsuarioCadastrar } from '../app.interface.js';
import { GlobalFunctions } from './global.service.js';

interface AuthResponse {
  token: string; 
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<any>(null);
  
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend
  public usuario = this.usuarioSubject.asObservable();
  public usuarioLogado!: Usuario;
  private usuarioLogadoSubject = new BehaviorSubject<boolean>(this.calculateIsUsuarioLogado());
  public isUsuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(private http: HttpClient, private GlobalFunctions: GlobalFunctions) {
    if(this.getToken() && !this.isUsuarioLogado()) {
      this.getInfoUsuario().subscribe(
        (res) => {
          this.usuarioLogado = res.data;
          this.GlobalFunctions.gerenciaMenuExterno(this.usuarioLogado.tipo_usuario.descricao);
          this.updateUsuarioLogado();
        },
        () => {
          this.GlobalFunctions.alertaDadosServidor();
        }
      );
    }else if(this.getToken()){
      this.GlobalFunctions.gerenciaMenuExterno(this.usuarioLogado.tipo_usuario.descricao);
    }
  }

  // Método de login
  login(email: string, senha: string): Observable<AuthResponse> {
    const body = { email, senha };
    return this.http.post<AuthResponse>(this.apiUrl + '/login', body);
  }

  // Método para guardar o token
  saveToken(token: string, expiracao: string): void {
    localStorage.setItem('authToken', `${token}`); // Armazena o token no localStorage
    localStorage.setItem('expiracao', `${expiracao}`); // Armazena o token no localStorage
  }

  isTokenValid(expiresAt: string): boolean {
    const expirationDate = new Date(expiresAt); // Converte a string para um objeto Date
    const now = new Date(); 
    console.log('ig');

    console.log(expirationDate, now);

    return now < expirationDate; // Retorna true se ainda não expirou
  }

  // Método para recuperar o token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      let dataExpiracao = localStorage.getItem('expiracao') ?? '';
      if(this.isTokenValid(dataExpiracao)){
        console.log('token valido');
        return localStorage.getItem('authToken');
      }else{
        console.log('token removido');
        localStorage.removeItem('authToken');
        localStorage.removeItem('expiracao');
      }
    }

    return null;
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    // Suponha que o token tem validade, por exemplo, com um tempo de expiração que você pode verificar aqui
    // Adicione sua lógica de validação de token (como verificar a expiração, por exemplo)
    return token !== null;
  }

  // Método para fazer logout
  logout(): void {
    this.usuarioLogado = {} as Usuario;
    localStorage.removeItem('expiracao');
    localStorage.removeItem('authToken');
    this.updateUsuarioLogado();
  }

  cadastrarUsuario(dados: UsuarioCadastrar): Observable<any> {

    return this.http.post<UsuarioCadastrar>(this.apiUrl + '/cadastro', dados);
  }

  isUsuarioLogado(): boolean {
    return this.usuarioLogadoSubject.value;
  }

  private calculateIsUsuarioLogado(): boolean {
    return (
      typeof window !== 'undefined' &&
      this.tipoUsuario !== '' &&
      !!localStorage.getItem('authToken')
    );
  }

  updateUsuarioLogado(): void {
    const value = this.calculateIsUsuarioLogado();
    this.usuarioLogadoSubject.next(value); // Notifica os observadores
  }

  get tipoUsuario(): string{
    if(!this.usuarioLogado || !this.usuarioLogado.tipo_usuario?.descricao) return '';
    if(this.usuarioLogado.tipo_usuario.descricao == 'Admin') return 'Admin';
    if(this.usuarioLogado.tipo_usuario.descricao == 'Cliente') return 'Cliente';

    return '';
  }

  getInfoUsuario(): Observable<any> {
    return this.http.get(this.apiUrl + '/usuario').pipe(
      tap((res: any) => this.usuarioSubject.next(res.data)) // Atualiza o BehaviorSubject
    );
  }
}