import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Newsfeed } from '../../common/newsfeed';
import { NewsfeedService } from '../../services/newsfeed.service';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatInputModule, MatButton, MatMenuModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private newsFeedService: NewsfeedService, private router: Router) { }

  query: string = '';
  results: Newsfeed[] = [];
  newsFeeds: Newsfeed[] = [];

  search(query: string) {
    this.query = query;
    console.log('Searching for:', query);

    if (!query.trim()) {
      this.results = [];
      return this.results;
    }
    
    this.newsFeedService.getNewsFeed().subscribe(
      data => {
        this.newsFeeds = data;
      
    
    this.results = this.newsFeeds.filter(item =>
      item.postTitle?.toLowerCase().includes(query.toLowerCase()) ||
      item.postCategory?.toLowerCase().includes(query.toLowerCase()) ||
      item.postText?.toLowerCase().includes(query.toLowerCase())      
    );
    
    console.log('Search results:', this.results);
  },
  error => {
    console.error('Error fetching news feeds:', error);
    this.results = [];
  });
    return this.results;
  }
  
  clearSearch() {
    this.query = '';
    this.results = [];
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    console.log('Search cleared');
  }

  navigateToProfile(userName: string) {
    this.router.navigate(['/profile', userName]);
  }

}
