import { Component, OnInit, ContentChild, Input, AfterContentInit } from '@angular/core';
import { FormControlName, NgModel } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterContentInit {

  @Input() label: string;
  @Input() errorMessage: string;
  @Input() class: string;

  input: any;

  @ContentChild(NgModel) model: NgModel;
  @ContentChild(FormControlName) control: FormControlName;

  constructor() { }

  ngOnInit() { }

  ngAfterContentInit() {
    this.input = this.model || this.control;
    if (!this.input) {
      console.warn(`O componente 'app-form' com o label '${this.label}' não encontrou ngModel ou formControlName`);
    }
  }

  hasSuccess(): boolean {
    return this.input && this.input.valid && (this.input.dirty || this.input.touched);
  }

  hasError(): boolean {
    return this.input && this.input.invalid && (this.input.dirty || this.input.touched);
  }
}
