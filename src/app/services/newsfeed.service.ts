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

  getUserByEmail(email: string): Observable<any> {
  return this.httpClient.get<any>(`http://localhost:8080/api/user/by-email?email=${encodeURIComponent(email)}`);
}

getUserPostById(postId: number): Observable<any> {
  return this.httpClient.get(this.baseUrl + '/' + postId);
}
}

interface GetResponse {
  _embedded: {
    userPosts: Newsfeed[];
  };
}


