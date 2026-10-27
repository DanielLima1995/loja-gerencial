import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.js';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, Usuario, UsuarioCadastrar } from '../app.interface.js';
import { GlobalFunctions } from './global.service.js';
import { ToastService } from '../components/toast/toast.service.js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private apiUrl = `${environment.apiUrl}`;
  public usuario = this.usuarioSubject.asObservable();
  public usuarioLogado: Usuario = {} as Usuario;
  private usuarioLogadoSubject = new BehaviorSubject<boolean>(this.calculateIsUsuarioLogado());
  public isUsuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private globalFunctions: GlobalFunctions,
    public toast: ToastService
  ) {
    if (this.getToken() && typeof window !== 'undefined') {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        this.usuarioLogado = JSON.parse(usuario) as Usuario;
        this.usuarioSubject.next(this.usuarioLogado);
      this.globalFunctions.gerenciaMenuExterno(this.tipoUsuario);
        this.updateUsuarioLogado();
      }
    }
  }

  login(email: string, password: string): Observable<unknown> {
    const body: LoginRequest = { email, password };
    return this.http.post<unknown>(`${this.apiUrl}/Auth/login`, body);
  }

  saveToken(token: string, expiracao: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
    localStorage.setItem('expiracao', expiracao);
  }

  saveUser(usuario: Usuario): void {
    this.usuarioLogado = usuario;
    this.usuarioSubject.next(usuario);
    if (typeof window !== 'undefined') {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }

  isTokenValid(expiresAt: string): boolean {
    const expirationDate = new Date(expiresAt);
    return !Number.isNaN(expirationDate.getTime()) && Date.now() < expirationDate.getTime();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const dataExpiracao = localStorage.getItem('expiracao') ?? '';
      if (this.isTokenValid(dataExpiracao)) {
        return localStorage.getItem('authToken');
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('expiracao');
      localStorage.removeItem('usuario');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    if (this.getToken()) {
      this.http.post<unknown>(`${this.apiUrl}/Auth/revoke`, null).subscribe({
        error: () => this.toast.show('Não foi possível invalidar a sessão no servidor.', 'error'),
      });
    }
    this.usuarioLogado = {} as Usuario;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('expiracao');
      localStorage.removeItem('authToken');
      localStorage.removeItem('usuario');
    }
    this.usuarioSubject.next(null);
    this.updateUsuarioLogado();
  }

  cadastrarUsuario(dados: UsuarioCadastrar): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/Auth/register`, dados);
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
    this.usuarioLogadoSubject.next(this.calculateIsUsuarioLogado());
  }

  get tipoUsuario(): string {
    const tipoUsuario = this.usuarioLogado?.tipoUsuario;
    const tipo = typeof tipoUsuario === 'string' ? tipoUsuario : tipoUsuario?.descricao;
    return tipo === 'Admin' || tipo === 'Cliente' ? tipo : '';
  }

  getInfoUsuario(): Observable<{ data: Usuario | null }> {
    const usuario = typeof window !== 'undefined' && localStorage.getItem('usuario')
      ? JSON.parse(localStorage.getItem('usuario') as string) as Usuario
      : this.usuarioLogado;
    this.usuarioSubject.next(usuario);
    return of({ data: usuario.tipoUsuario ? usuario : null });
  }
}
