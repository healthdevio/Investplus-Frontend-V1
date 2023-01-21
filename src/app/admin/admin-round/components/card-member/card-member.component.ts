import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card-member',
  templateUrl: './card-member.component.html',
  styleUrls: ['./card-member.component.css']
})
export class CardMemberComponent implements OnInit {

  @Input() name: string;
  @Input() department: string;
  @Input() activities: string;
  @Input() description: string;
  @Input() linkedin: string;
  @Input() photo: string;
  @Input() showButtonAction: boolean;

  @Output() edit: EventEmitter<boolean> = new EventEmitter();
  @Output() remove: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
  }

  onEdit(){
    this.edit.emit();
  }

  onRemove(){
    this.remove.emit();
  }

}
