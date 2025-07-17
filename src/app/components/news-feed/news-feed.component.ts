import { Component } from '@angular/core';
import { NewsfeedService } from '../../services/newsfeed.service';
import { Newsfeed } from '../../common/newsfeed';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.css'
})
export class NewsFeedComponent {

  newsFeeds: Newsfeed[] = [];
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
  
}
