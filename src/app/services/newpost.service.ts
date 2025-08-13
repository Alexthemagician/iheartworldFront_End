import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Newsfeed } from '../common/newsfeed';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NewpostService {

  private baseUrl = 'http://localhost:8080/api/userPosts';

  constructor(private httpClient:HttpClient) { }

  postToNewsFeed(postData: any): Observable<any> {
  return this.httpClient.post<any>(this.baseUrl, postData);
}

getUserByEmail(email: string): Observable<any> {
  return this.httpClient.get<any>(`http://localhost:8080/api/user/by-email?email=${encodeURIComponent(email)}`);
}
}
