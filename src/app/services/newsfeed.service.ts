import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Newsfeed } from '../common/newsfeed';
import { map, Observable } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {

  private baseUrl = 'http://localhost:8080/api/userPosts';

  constructor(private httpClient:HttpClient) { }

  getNewsFeed(): Observable<Newsfeed[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.userPosts)
    );
  }
}

interface GetResponse {
  _embedded: {
    userPosts: Newsfeed[];
  };
}
