import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'date' })

export class DateMaskPipe implements PipeTransform {
    transform(date: string = "", type = ""): string {
        if (!date) {
            return ""
        }

        const datePart = date.match(/\d+/g);
        console.log('[date]', date);
        console.log('[datePart]', datePart);
        let year, month, day;
        if (type === "AMERICAN") {
            year = datePart[2].substring(0),
                month = datePart[1],
                day = datePart[0];
            return year + '-' + month + '-' + day;
        } else {
            year = datePart[0].substring(0),
                month = datePart[1],
                day = datePart[2];
            return `${day}/${month}/${year}`
        }
    }
}
