import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'contractStatusPipe' })
export class ContractStatusPipe implements PipeTransform {
  transform(status: string = "") {
    let output: string;
    switch (status) {
      case 'PENDING':
        output = 'PENDENTE';
        break;
      case 'SIGNED':
        output = 'ASSINADO';
        break;
      case 'CREATED':
        output = 'EM PROCESSAMENTO';
        break;
      default:
        output = 'PENDENTE'
    }
    return output;
  }
}
