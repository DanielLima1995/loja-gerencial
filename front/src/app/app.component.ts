import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HttpRequestStateService } from './http-request-state.service';
import { globalModules } from './globalModules';
import { Menu } from './app.interface';
import { AuthService } from './services/auth.service';
import Swal from 'sweetalert2';
import { FooterComponent } from './components/footer/footer.component';
import { CarregamentoComponent } from './components/carregamento/carregamento.component';
import { GlobalFunctions } from './services/global.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    TopBarComponent,
    FontAwesomeModule,
    NgSelectModule,
    CommonModule,
    HttpClientModule,
    ...globalModules,
    FooterComponent,
    CarregamentoComponent
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  
  title = 'loja';
  myModel: any;
  faCoffee = faCoffee;
  isLoading$: any;
  inicialLoad = true;
  carregando = true;
  itemAtivo = '';
  constructor(library: FaIconLibrary, private router: Router, private httpRequestStateService: HttpRequestStateService, private authService: AuthService, public GlobalFunctions: GlobalFunctions) {
    library.addIcons(
      faSquare,
      faCheckSquare,
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let strSplit = event.url.split('/');
        if(strSplit && strSplit[2]){
          this.itemAtivo = strSplit[2];
        }else{
          this.itemAtivo = '';
        }
        console.log('Navigated to:', event.url);
      }
    });

    this.isLoading$ = this.httpRequestStateService.isLoading$;

    
  }

  

  get isAdminArea(){
    if (typeof window !== "undefined") {
      return window.location.pathname.indexOf('admin') > -1;
    }else{
      return false;
   }
  }

  get isClienteArea(){
    if (typeof window !== "undefined") {
      return window.location.pathname.indexOf('cliente') > -1;
    }else{
      return false;
   }
  }

  get menusContent(): Array<Menu>{
    if(this.isClienteArea) return  [{
        title: 'Pedidos',
        link: '/cliente/pedidos',
        icon: 'fa fa-shopping-bag',
        ref: 'pedidos'
      },{
        title: 'Endereços',
        link: '/cliente/enderecos',
        icon: 'fa fa-home',
        ref: 'enderecos'
      }];
    
      return [{
        title: 'Vendas',
        link: '/admin/vendas',
        icon: 'fa fa-shopping-bag',
        ref: 'vendas'
      },{
        title: 'Produtos',
        link: '/admin/produtos/cadastrados',
        icon: 'fa fa-list',
        ref: 'cadastrados'
      },{
        title: 'Tags',
        link: '/admin/tags',
        icon: 'fa fa-tags',
        ref: 'tags'
      }];
  }

  ngOnInit(){
    console.log('app nginit')
    if(typeof window !== 'undefined'){
      this.carregando = false;
    }
  }

  logout(){
    this.authService.logout();
    this.GlobalFunctions.alerta('Logout Efetuado', 'Logout realizado com sucesso', 'success');
          setTimeout(() => {
            if(window.location.pathname === "/"){
              window.location.reload();
            }else{
              this.router.navigate(['/']);
            }
          }, 2000);
  }

  changeStatusMenuInterno(){
    this.GlobalFunctions.showMenuInterno = !this.GlobalFunctions.showMenuInterno;
  }
}
