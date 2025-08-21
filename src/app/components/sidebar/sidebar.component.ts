import { Component } from '@angular/core';
import { NewpostComponent } from '../newpost/newpost.component';
import { CommonModule } from '@angular/common';

import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { DataTransferService } from '../../services/data-transfer.service';``



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NewpostComponent, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  receivedData: any;
  isModalVisible = false;
  isNewsFeedVisible = true;
  postText: string = '';
  isEditMode: boolean = false;
  editedText: string = '';
  editedPostId: number = 0;
  editedImgUrl: string = '';
  editedVideoUrl: string = '';
  editedDateCreated: Date = new Date();

  constructor(private dataTransferService: DataTransferService) {}

  ngOnInit() {
    this.dataTransferService.currentData.subscribe(data => {
      this.receivedData = data;
      if (this.receivedData) {
        this.isEditMode = this.receivedData.isEditMode;
        this.editedText = this.receivedData.editedText;
        this.editedPostId = this.receivedData.editedPostId;
        this.editedImgUrl = this.receivedData.editedImgUrl;
        this.editedVideoUrl = this.receivedData.editedVideoUrl;
        this.editedDateCreated = this.receivedData.editedDateCreated;
        if (this.isEditMode) {
          this.postText = this.editedText;          
        }
      }
    });
  }

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
