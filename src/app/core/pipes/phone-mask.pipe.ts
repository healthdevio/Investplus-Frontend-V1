import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone' })
export class PhoneMaskPipe implements PipeTransform {
    transform(phone: string = "") {
        if (!phone) {
            return ''
        }

        phone = phone.replace(/\D/g, "");
        phone = phone.replace(/^(\d{2})(\d)/g, "($1) $2");
        phone = phone.replace(/(\d)(\d{4})$/, "$1-$2")
        return phone;
    }
}