import { Component } from '@angular/core';
import { NewsfeedService } from '../../services/newsfeed.service';
import { Newsfeed } from '../../common/newsfeed';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../common/user';
import { NewpostComponent } from '../newpost/newpost.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '@auth0/auth0-angular';
import { DataTransferService } from '../../services/data-transfer.service';



@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, NewpostComponent, SidebarComponent],
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.css'
})
export class NewsFeedComponent {

  
  newsFeeds: Newsfeed[] = [];  
  isModalVisible = false;
  cloudname = "dpevuiym0";
  uploadPreset = "ml_default";

  postImgUrl: string = '';
  userId: string = '';  
  postText: string = '';
  postVideoUrl: string = '';
  postId: number = 0;
  
  
  private baseUrl = new URL('http://localhost:8080/api/userPosts');

  //Edited post variables
  isEditMode: boolean = false;
  editedText: string = '';  
  editedPostId: number = 0;
  editedImgUrl: string = '';
  editedVideoUrl: string = '';
  editedDateCreated: Date = new Date();

  constructor(private newsFeedService: NewsfeedService, private auth: AuthService, private dataTransferService: DataTransferService) {}

  ngOnInit(): void {
    this.listNewsFeeds();
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.newsFeedService.getUserByEmail(user.email).subscribe(
          backendUser => {
            this.userId = backendUser.userName;                                   
          },
          error => {
            console.error('Error fetching user from backend:', error);
          }
        );
      }
    });    
    
  }
  listNewsFeeds() {
    this.newsFeedService.getNewsFeed().subscribe(
      data=> {
        this.newsFeeds = data;
      }
    ) 
  }

  

  userIdMatch(): boolean {
    if (this.userId === User.userName) {
      return true;
    } else {
      return false;
    }
  }

  editPost(tempNewsfeed: any) {    
    
    this.isModalVisible = true;
    this.isEditMode = true;
    const match = tempNewsfeed._links?.self?.href.match(/\/(\d+)$/);
    const postId = match ? parseInt(match[1], 10) : null;
    this.postText = tempNewsfeed.postText;
    const editedText = this.postText;
    this.editedText = editedText;
    const editedImgUrl = tempNewsfeed.postImgUrl;
    this.editedImgUrl = editedImgUrl;
    const editedVideoUrl = tempNewsfeed.postVideoUrl;
    this.editedVideoUrl = editedVideoUrl;
    const editedDateCreated = tempNewsfeed.dateCreated;
    this.editedDateCreated = editedDateCreated;
    if (postId!== null) {
    this.editedPostId = postId;
    }
    console.log(postId);
    console.log(editedText);
    this.listNewsFeeds();
    
    this.sendData();
          
            
    
  }

  sendData() {
      const data = {
        editedText: this.editedText,
        isEditMode: this.isEditMode,
        editedPostId: this.editedPostId,
        editedImgUrl: this.editedImgUrl,
        editedVideoUrl: this.editedVideoUrl,
        editedDateCreated: this.editedDateCreated,
      };
      this.dataTransferService.changeData(data);
    }

  showModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isEditMode = false;
    this.isModalVisible = false;
  }
  

  deletePost(tempNewsfeed: any) {
    //NewsFeedComponent.isEditMode = true;
    const match = tempNewsfeed._links?.self?.href.match(/\/(\d+)$/);
    const postId = match ? parseInt(match[1], 10) : null;
    console.log(postId);
    console.log(match);
    if (postId === parseInt(match[1], 10) && postId!== null) {      
          this.newsFeedService.deleteUserPost(postId).subscribe(
            response => {
              console.log('Post deleted successfully:', response);
              this.listNewsFeeds(); // Refresh the news feed after deletion
            },
            error => {
              console.error('Error deleting post:', error);
            }
          );         
                         
        }
      

  }
  

}

