import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Newsfeed } from '../common/newsfeed';
import { map, Observable } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Groupfeed } from '../common/groupfeed';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {  

  private baseUrl = 'http://localhost:8080/api/userPosts';
  private groupPostUrl = 'http://localhost:8080/api/groupPosts';

  constructor(private httpClient:HttpClient) { }

  getNewsFeed(): Observable<Newsfeed[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.userPosts)
    );
  }

  getGroupFeedById(groupId: number): Observable<Groupfeed[]> {
    const url = `${this.groupPostUrl}?groupId=${groupId}`;
    console.log('NewsfeedService: Fetching group posts from URL:', url);
    
    return this.httpClient.get<GetResponse>(url).pipe(
      map(response => {
        console.log('NewsfeedService: Raw response:', response);
        const posts = response._embedded?.groupPosts || [];
        console.log('NewsfeedService: Extracted posts:', posts);
        return posts;
      })
    );
  }

  getUserByEmail(email: string): Observable<any> {
  return this.httpClient.get<any>(`http://localhost:8080/api/user/by-email?email=${encodeURIComponent(email)}`);
}

getUsers(): Observable<User[]> {
  return this.httpClient.get<GetResponse>('http://localhost:8080/api/user').pipe(
    map(response => response._embedded?.users)
  );
}

updateUser(updateData: any): Observable<any> {
  return this.httpClient.put(`http://localhost:8080/api/user/${updateData.id}`, updateData);
}

postToUsers(user: any): Observable<any> {
  return this.httpClient.post<any>('http://localhost:8080/api/user', user);
}

getUserPostById(postId: number): Observable<any> {
  return this.httpClient.get(this.baseUrl + '/' + postId);
}

updateUserPost(post: Newsfeed): Observable<any> {
  return this.httpClient.put(this.baseUrl + '/' + post.postId, post);
}
  deleteUserPost(postId: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + '/' + postId);
  }

updateGroupPost(post: Groupfeed): Observable<any> {
  return this.httpClient.put(this.groupPostUrl + '/' + post.postId, post);
}

deleteGroupPost(postId: number): Observable<any> {
  return this.httpClient.delete(this.groupPostUrl + '/' + postId);

}

}

interface GetResponse {
  _embedded: {
    userPosts: Newsfeed[];
    groupPosts: Groupfeed[];
    users: User[];
  };
}


