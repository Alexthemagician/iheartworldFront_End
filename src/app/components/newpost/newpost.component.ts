import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';




@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [],
  templateUrl: './newpost.component.html',
  styleUrl: './newpost.component.css'
})
export class NewpostComponent {
  
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

}
