import { Injectable, EventEmitter } from '@angular/core';

export interface EventEmitted {
  name: String;
  data?: any;
}

@Injectable()
export class EventEmitterService {

  emitter = new EventEmitter();

  constructor() { }

  send(data: EventEmitted) {
    this.emitter.emit(data);
  }
}
