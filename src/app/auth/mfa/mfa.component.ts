import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-mfa',
    templateUrl: './mfa.html'
})
export class MFAComponent {
    @Input() destination: string;
    @Input() onSubmit: (code: string) => void;

    constructor() {
    }
}
