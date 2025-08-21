import { Component } from '@angular/core';
import { NewpostComponent } from '../newpost/newpost.component';
import { CommonModule } from '@angular/common';
import { NewsFeedComponent } from "../news-feed/news-feed.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NewpostComponent, CommonModule, NewsFeedComponent, RouterLink, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isModalVisible = false;
  isNewsFeedVisible = true;
  isEditMode: boolean = NewsFeedComponent.isEditMode;

  showModal() {
    this.isModalVisible = true;    
  }

  hideModal() {
    this.isModalVisible = false;
  }

  hideNewsFeed() {
    this.isNewsFeedVisible = false;
  }
  
}
