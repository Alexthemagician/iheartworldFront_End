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

  postImgUrl: string = '';
  userId: string = '';  
  postText: string = '';
  postVideoUrl: string = '';
  postId: number = 0;
  
  editedText: string = '';
  private baseUrl = new URL('http://localhost:8080/api/userPosts');
  static isEditMode: boolean;
  static editedText: string = '';
  static editedPostId: number = 0;
  static editedImgUrl: string = '';
  static editedVideoUrl: string = '';
  static editedDateCreated: Date = new Date();
  constructor(private newsFeedService: NewsfeedService, private auth: AuthService) {}

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
    NewsFeedComponent.isEditMode = true;
    const match = tempNewsfeed._links?.self?.href.match(/\/(\d+)$/);
    const postId = match ? parseInt(match[1], 10) : null;
    this.postText = tempNewsfeed.postText;
    const editedText = this.postText;
    NewsFeedComponent.editedText = editedText;
    const editedImgUrl = tempNewsfeed.postImgUrl;
    NewsFeedComponent.editedImgUrl = editedImgUrl;
    const editedVideoUrl = tempNewsfeed.postVideoUrl;
    NewsFeedComponent.editedVideoUrl = editedVideoUrl;
    const editedDateCreated = tempNewsfeed.dateCreated;
    NewsFeedComponent.editedDateCreated = editedDateCreated;
    if (postId!== null) {
    NewsFeedComponent.editedPostId = postId;
    }
    console.log(postId);
    console.log(editedText);
    this.listNewsFeeds();
    return {
      editedText: NewsFeedComponent.editedText,
      isEditMode: NewsFeedComponent.isEditMode,
      editedPostId: NewsFeedComponent.editedPostId,
      editedImgUrl: NewsFeedComponent.editedImgUrl,
      editedVideoUrl: NewsFeedComponent.editedVideoUrl,
      editedDateCreated: NewsFeedComponent.editedDateCreated,
    }
    
    
    
    
    
    
    
  }

  showModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    NewsFeedComponent.isEditMode = false;
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

