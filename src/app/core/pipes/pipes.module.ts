import { NumberMaskPipe } from './number-mask.pipe';
import { DateMaskPipe } from './date-mask.pipe';
import { CepMaskPipe } from './cep-mask.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyMaskPipe } from './money-mask.pipe';
import { CpfMaskPipe } from './cpf-mask.pipe';
import { CnpjMaskPipe } from './cnpj-mask.pipe';
import { PhoneMaskPipe } from './phone-mask.pipe';
import { ContractStatusPipe } from './contract-status.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        MoneyMaskPipe,
        CpfMaskPipe,
        CnpjMaskPipe,
        PhoneMaskPipe,
        CepMaskPipe,
        DateMaskPipe,
        NumberMaskPipe,
        ContractStatusPipe
    ],
    exports: [
        MoneyMaskPipe,
        CpfMaskPipe,
        CnpjMaskPipe,
        PhoneMaskPipe,
        CepMaskPipe,
        DateMaskPipe,
        NumberMaskPipe,
        ContractStatusPipe
    ]
})

export class PipesModule { }
