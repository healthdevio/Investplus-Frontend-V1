import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'moneyMask' })
export class MoneyMaskPipe implements PipeTransform {
  transform(value: number = 0, sifrao = false): string {
    let dinheiro = value ? value : 0;
    let formattedValue = dinheiro.toLocaleString('pt-br', { minimumFractionDigits: 2 });
    return sifrao ? `R$ ${formattedValue}` : formattedValue;
  }
}
