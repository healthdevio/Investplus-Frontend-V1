import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cep' })
export class CepMaskPipe implements PipeTransform {
    transform(cep: string = "") {
        if (!cep) {
            return ''
        }
        cep = cep.replace(/\D/g, "")
        cep = cep.replace(/^(\d{2})(\d)/, "$1.$2")
        cep = cep.replace(/\.(\d{3})(\d)/, ".$1-$2")
        return cep

    }
}