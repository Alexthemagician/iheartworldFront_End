import { Component } from '@angular/core';
import { NewsfeedService } from '../../services/newsfeed.service';
import { Newsfeed } from '../../common/newsfeed';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../common/user';
import { NewpostComponent } from '../newpost/newpost.component';

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule],
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.css'
})
export class NewsFeedComponent {

  newsFeeds: Newsfeed[] = [];
  userId: string = '';
  constructor(private newsFeedService: NewsfeedService) {}

  ngOnInit(): void {
    this.listNewsFeeds();

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

  editPost() {
    
  }

  deletePost() {

  }
  
}
