import { Component, Input } from '@angular/core';
import { InputNumericoComponent } from '../../../../components/input-numerico/input-numerico.component';
import { SelectCoresComponent } from '../../../../components/select-cores/select-cores.component';
import { SelectTamanhosComponent } from '../../../../components/select-tamanhos/select-tamanhos.component';
import { globalModules } from '../../../../globalModules';

@Component({
  selector: 'app-product-preview',
  imports: [
    ...globalModules,
    InputNumericoComponent,
    SelectCoresComponent,
    SelectTamanhosComponent
  ],
   templateUrl: './product-preview.component.html',
  styleUrl: './product-preview.component.scss'
})
export class ProductPreviewComponent {
  @Input() dadosCadastrados: any;
  constructor(
  ){
  }

  ngOnInit(){
    

    
  }
}
