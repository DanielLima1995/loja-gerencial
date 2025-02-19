import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.js';
import { Observable } from 'rxjs';
import { HttpClient
  
 } from '@angular/common/http';
import { MenuExterno } from '../app.interface.js';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class GlobalFunctions {
  menuExterno: Array<MenuExterno> = [];
  isMobile: boolean = false;
  showMenuInterno = true;
  private apiUrl = `${environment.apiUrl}`; // Substitua pela URL correta da API do seu backend

  constructor(private http: HttpClient) { }

  // Método de login
  
  gerenciaMenuExterno(tipoUsuario: string){
    if(tipoUsuario == 'Cliente') {
      this.menuExterno = [{
        title: 'Pedidos',
        link: '/cliente/pedidos',
        icon: 'fa fa-shopping-bag'
      },{
        title: 'Endereços',
        link: '/cliente/enderecos',
        icon: 'fa fa-home'
      }]; 
    }  else if(tipoUsuario == 'Admin'){
      this.menuExterno = [{
        title: 'Vendas',
        link: '/admin/vendas',
        icon: 'fa fa-shopping-bag'
      },{
        title: 'Produtos',
        link: '/admin/produtos/cadastrados',
        icon: 'fa fa-list'
      },{
        title: 'Tags',
        link: '/admin/tags',
        icon: 'fa fa-tags'
      }]
    }else{
      this.menuExterno = [];
    }
  }

  get isIndex(){
    if (typeof window !== "undefined") {
      return window.location.pathname === "/";
    }else{
      return false;
   }
  }

  alerta(title: string, mensagem: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question') {
    Swal.fire({
      title: title,
      text: mensagem,
      icon: icon, // Tipos: 'success', 'error', 'warning', 'info', 'question'
      confirmButtonText: 'OK!'
    });
  }

  alertaDadosServidor(){
    this.alerta('Erro ao Receber Dados', 'Ocorreu uma falha ao receber os dados do servidor. Tente novamente mais tarde.', 'error')
  }

  valorConvertido(valor: any, replaceFormatter: boolean = false){
    valor = parseFloat(valor);
    const formatter = new Intl.NumberFormat('default', {
      style: 'currency',
      currency: 'BRL',
    });

    let r = formatter.format(valor);

    return (replaceFormatter ? r.replace('R$', '') : r);
  }
}