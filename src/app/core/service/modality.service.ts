import { Injectable } from '@angular/core';

export type Modality = {
  initials: string,
  description: string
}


@Injectable({
  providedIn: 'root'
})
export class ModalityService {

  constructor() {}

  getModalities(): Modality[]{
    return [
      {
        initials: "RECOMPRA",
        description: "RECOMPRA",
      },
      {
        initials: "SCP",
        description: "SCP",
      },
      {
        initials: "SAIDA",
        description: "SAÍDA",
      },
      {
        initials: "TRANSFORMACAO_SA",
        description: "TRANSFORMAÇÃO S/A",
      },
      {
        initials: "MODALIDADE_ATUAL",
        description: "MODALIDADE ATUAL",
      },
      {
        initials: "MUTUO_CONVERSIVEL",
        description: "MÚTUO CONVERSÍVEL",
      },
      {
        initials: "SAFE",
        description: "SAFE",
      },
    ];
  }

  getModality(initials: string): Modality {
    return this.getModalities().find(modalidade => modalidade.initials == initials);
  }
}
