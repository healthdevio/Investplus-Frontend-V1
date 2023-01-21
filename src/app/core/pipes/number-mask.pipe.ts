import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'number' })
export class NumberMaskPipe implements PipeTransform {
    transform(number: string = "") {
        if (!number) {
            return ''
        }
        return (Number(number.replace(/[^\d]+/g, '')) / 100).toFixed(2);
    }
}