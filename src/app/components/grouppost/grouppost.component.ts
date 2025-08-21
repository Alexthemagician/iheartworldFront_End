import { Component } from '@angular/core';
import { NewpostComponent } from '../newpost/newpost.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-grouppost',
  standalone: true,
  imports: [],
  templateUrl: './grouppost.component.html',
  styleUrl: './grouppost.component.css'
})



export class GrouppostComponent extends NewpostComponent {

  postComponent!: NewpostComponent;
  isGroupPost: boolean = true;

  override postNewPost() {
    
  };


}
