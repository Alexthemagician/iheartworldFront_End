import { Component } from '@angular/core';
import { NewpostComponent } from '../newpost/newpost.component';
import { CommonModule } from '@angular/common';
import { GrouppostComponent } from '../grouppost/grouppost.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { DataTransferService } from '../../services/data-transfer.service';``



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NewpostComponent, CommonModule, RouterLink, RouterOutlet, GrouppostComponent],
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
  isGroupModalVisible = false;
  pathname: string = window.location.pathname;
  pathMatch: RegExp = /^\/groupfeed(\/\d+)?$/; 

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
    //if statement to show group post modal
    if (this.pathname.match(this.pathMatch)) {
      this.isGroupModalVisible = true;
    }
    else {
      this.isModalVisible = true;
    }
  }

  hideModal() {
    this.isModalVisible = false;
  }

  hideGroupModal() {
    this.isGroupModalVisible = false;
  }

  hideNewsFeed() {
    this.isNewsFeedVisible = false;
  }
  
}
