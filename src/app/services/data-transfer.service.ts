import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Group } from '../common/group';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private groupUrl = 'http://localhost:8080/api/groups';
  private groupMembersUrl = 'http://localhost:8080/api/groupMembers';
  private dataSource = new BehaviorSubject<any>(null);
  currentData = this.dataSource.asObservable(); 

  constructor(private httpClient: HttpClient) { }

  changeData(data: any) {
    this.dataSource.next(data);
  }

  

  getUserByEmail(email: string): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:8080/api/user/by-email?email=${encodeURIComponent(email)}`);
  }

  postGroupData(groupData: any): Observable<any> {
  return this.httpClient.post<any>(this.groupUrl, groupData);
}

  getGroups(): Observable<Group[]> {
    return this.httpClient.get<GetResponse>(this.groupUrl).pipe(
      map((response: GetResponse): Group[] => response._embedded.groups)
    );
  }

  getGroupById(groupId: number): Observable<any> {
    return this.httpClient.get<Group>(`${this.groupUrl}/${groupId}`);
  }

  addMemberToGroup(newMember: any): Observable<any> {
    return this.httpClient.post<any>(this.groupMembersUrl, newMember);
  }

  getMemberId(groupId: number, memberName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.groupMembersUrl}/by-id`, { params: { groupId, memberName } });
    
  }

  removeMemberFromGroup(groupId: number, memberIdentifier: string | number): Observable<any> {
    if (typeof memberIdentifier === 'string') {
      // ✅ Delete by member name using query parameters
      return this.httpClient.delete(`${this.groupMembersUrl}?groupId=${groupId}&memberName=${encodeURIComponent(memberIdentifier)}`);
    } else {
      // ✅ Delete by member ID using path parameters
      return this.httpClient.delete(`${this.groupMembersUrl}/group/${groupId}/member/${memberIdentifier}`);
    }
  }

  getCurrentGroupId(): number {
    const currentData = this.dataSource.getValue();
    return currentData ? currentData.groupId : 0;
  }

  getCurrentUserId(): string {
    const currentData = this.dataSource.getValue();
    return currentData ? currentData.userId : '';
  }

  getMembersOfGroup(groupId: number): Observable<string[]> {
    return this.httpClient.get<String[]>(`${this.groupMembersUrl}?groupId=${groupId}`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {        
          return response.map((member: any) => member.memberName);
        }
        return [];
      })
    );
  }
}

  

interface GetResponse {
  _embedded: {
    groups: Group[];
    groupMembers: string[];
  };
}




