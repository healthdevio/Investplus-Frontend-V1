import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TitleHeader } from '../interface/title-header';

@Injectable()
export class TitleService {
  public titleHeader = new TitleHeader();
  public messageSource = new BehaviorSubject(this.titleHeader);
  currentMessage = this.messageSource.asObservable();

  constructor() {
    this.titleHeader.title = '';
   }

   changeTitle(titleHeader: TitleHeader) {
     this.messageSource.next(titleHeader);
   }
}
