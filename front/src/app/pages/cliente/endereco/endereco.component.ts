
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EnderecoService } from './endereco.service';

import { Endereco } from '../../../app.interface';
import { globalModules } from '../../../globalModules';
import { CarregamentoComponent } from '../../../components/carregamento/carregamento.component';
import { GlobalFunctions } from '../../../services/global.service';

@Component({
  selector: 'app-enderecos',
  imports: [...globalModules,
    CarregamentoComponent
    
    
  ],
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent {
  @Input() checkout: boolean = false;
  @Output() enderecoSelecionado: EventEmitter<number> = new EventEmitter<number>();
  carregando = true;

  enderecos: Endereco[] = [];
  idEnderecoSelecionado: number = 0;

  constructor(public enderecoService: EnderecoService, private globalFunctions: GlobalFunctions) {
  }

  ngOnInit(): void {
    this.enderecoService.index().subscribe(
      (data) => {
        this.enderecos = data;
        this.carregando = false;

      },
      (error) => {
        this.globalFunctions.alertaDadosServidor();
      }
    );
  }

  selecionarEndereco(id: number){
    this.idEnderecoSelecionado = id;
    this.enderecoSelecionado.emit(id);
  }

}
