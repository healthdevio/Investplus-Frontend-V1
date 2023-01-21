import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'moneyMask'})
export class MoneyMaskPipe implements PipeTransform {
  transform(value: number = 0, sifrao = false): string {
    let dinheiro = value ? value : 0;
    return dinheiro.toLocaleString('pt-br', !sifrao ? { minimumFractionDigits: 2 } : { style: 'currency', currency: 'BRL' });
  }
}