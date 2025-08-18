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
  private baseUrl = new URL('http://localhost:8080/api/userPosts');
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
    const match = tempNewsfeed._links?.self?.href.match(/\/(\d+)$/);
    const postId = match ? parseInt(match[1], 10) : null;
    
    console.log(postId);
    
  }

  showModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }
  

  deletePost() {

  }
  
}
