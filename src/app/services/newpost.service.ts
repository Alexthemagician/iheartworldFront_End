import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Newsfeed } from '../common/newsfeed';
import { Observable } from 'rxjs';
import { PostData } from '../common/basepostcomponent';


@Injectable({
  providedIn: 'root'
})
export class NewpostService {

  private baseUrl = 'http://localhost:8080/api/userPosts';
  private groupPostUrl = 'http://localhost:8080/api/groupPosts';

  constructor(private httpClient:HttpClient) { }

  postToNewsFeed(postData: PostData): Observable<any> {
  return this.httpClient.post<any>(this.baseUrl, postData);
}

updateUserPost(editedPostData: PostData): Observable<any> {
  return this.httpClient.put(this.baseUrl + '/' + editedPostData.postId, editedPostData);
}

//Group Posts
postToGroupFeed(postData: PostData): Observable<any> {
  return this.httpClient.post<any>(this.groupPostUrl, postData);
}

updateGroupPost(editedPostData: PostData): Observable<any> {
  return this.httpClient.put(this.groupPostUrl + '/' + editedPostData.postId, editedPostData);
}

getUserByEmail(email: string): Observable<any> {
  return this.httpClient.get<any>(`http://localhost:8080/api/user/by-email?email=${encodeURIComponent(email)}`);
}


}
