import { Component } from '@angular/core';
import { globalModules } from '../../globalModules';
import { GlobalFunctions } from '../../services/global.service';
import { ProdutosRelacionadosComponent } from '../../components/produtos-relacionados/produtos-relacionados.component';

@Component({
  selector: 'app-home',
  imports: [...globalModules,
    ProdutosRelacionadosComponent,
    


  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    public GlobalFunctions: GlobalFunctions
  ){
    
  }
}
