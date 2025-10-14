import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from "../navigation/navigation.component";
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NewsfeedService } from '../../services/newsfeed.service';
import { Newsfeed } from '../../common/newsfeed';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ CommonModule, FormsModule, NavigationComponent, SidebarComponent ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  constructor(private newsFeedService: NewsfeedService, private router: Router) {}

  category1: string = 'General';
  category2: string = 'Technology';
  category3: string = 'Lifestyle';
  category4: string = 'Funny';

  results: Newsfeed[] = [];
  query: string = '';
  newsFeeds: Newsfeed[] = [];
  postCategory: string = '';

  searchCategory(postCategory: string) {
    this.query = postCategory;
    console.log('Searching for:', this.query);
    this.results = [];
    this.newsFeedService.getNewsFeed().subscribe(
      data => {
        this.newsFeeds = data;

    this.results = this.newsFeeds.filter(item =>
      item.postCategory?.toLowerCase().includes(this.query.toLowerCase())
    );

    console.log('Search results:', this.results);
  },
  error => {
    console.error('Error fetching news feeds:', error);
    this.results = [];
  });
    return this.results;
  }

  navigateToProfile(userName: string) {
    this.router.navigate(['/profile', userName]);
  }

}
