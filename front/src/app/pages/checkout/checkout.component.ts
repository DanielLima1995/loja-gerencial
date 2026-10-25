import { Component } from '@angular/core';
import { EnderecoComponent } from '../cliente/endereco/endereco.component';
import { CartComponent } from '../cart/cart.component';
import { globalModules } from '../../globalModules';
import { CartaoComponent } from '../../components/cartao/cartao.component';
import { GlobalFunctions } from '../../services/global.service';
import Swal from 'sweetalert2';
import { CheckoutService } from './checkout.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  imports:[
    EnderecoComponent,
    CartComponent,
    ...globalModules,
    CartaoComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
    cartaoValido = false;
    idEndereco: number = 0;
    formaPagamento: 'Crédito' | 'Débito' | 'Pix' = 'Crédito';
  
    constructor(
    public GlobalFunctions: GlobalFunctions,
    private checkoutService: CheckoutService,
    private router: Router,
    
  ){
  }

  ngOnInit(){
  }

  onCartaoValido(isValid: boolean): void {
    this.cartaoValido = isValid;
  }

  get exigeValidacaoCartao(): boolean {
    return this.formaPagamento !== 'Pix';
  }

  changeEnderecoSelecionado(idEndereco: any){
    this.idEndereco = idEndereco;
  }

  finalizaCompra(){
    if(this.idEndereco && (!this.exigeValidacaoCartao || this.cartaoValido)){
      this.checkoutService.finalizaCompra(
        {enderecoId: this.idEndereco, formaPagamento: this.formaPagamento}
      ).subscribe(
        (data) => {
        this.GlobalFunctions.alerta('Compra Finalizada','Sua compra foi concluída com sucesso. O pagamento está em processamento.','success');

        setTimeout(() => {
          this.router.navigate(['cliente/pedidos'])
        }, 2000);
        },
        () => {
          this.GlobalFunctions.alerta('Erro no Servidor','Ocorreu um erro no servidor ao tentar finalizar a compra. Por favor, tente novamente mais tarde.','error');
        }
      )
    }else{
      if(!this.idEndereco){
        this.GlobalFunctions.alerta('Endereço Não Selecionado','Você precisa selecionar um endereço de entrega para continuar com a compra.','error');
      }else{
        this.GlobalFunctions.alerta('Cartão Inválido', 'O cartão de crédito inserido é inválido. Verifique as informações e tente novamente.', 'error');
      }
    }
  }
}
