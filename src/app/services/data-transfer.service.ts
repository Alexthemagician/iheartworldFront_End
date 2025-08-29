import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private dataSource = new BehaviorSubject<any>(null);
  currentData = this.dataSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  changeData(data: any) {
    this.dataSource.next(data);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:8080/api/user/by-email?email=${encodeURIComponent(email)}`);
  }
}


  

