import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMaskMoney]'
})
export class MaskMoneyDirective {

  private decimalSeparator = ','; // Separador decimal
  private thousandSeparator = '.'; // Separador de milhar

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(): void {
    const input = this.el.nativeElement;
    let value = input.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    if (value.length > 2) {
      value = value.replace(/^0+/, ''); // Remove zeros à esquerda
      const intPart = value.slice(0, -2); // Parte inteira
      const decimalPart = value.slice(-2); // Parte decimal

      value = this.formatNumber(intPart) + this.decimalSeparator + decimalPart;
    } else {
      value = '0' + this.decimalSeparator + value.padStart(2, '0'); // Adiciona zeros à esquerda se necessário
    }

    input.value = value;
  }

  private formatNumber(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
  }

}
