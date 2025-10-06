import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { NewsfeedService } from '../../services/newsfeed.service';
import { AuthService } from '@auth0/auth0-angular';
import { DataTransferService } from '../../services/data-transfer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  constructor(private auth: AuthService, private newsFeedService: NewsfeedService, private dataTransferService: DataTransferService) { }

  isLoggedIn: boolean = false;
  userName: string = '';
  id: number = 0;
  message: string = '';
  dateCreated: Date = new Date();
  lastUpdated: Date = new Date();
  receivedData: any;
  notifications: any[] = [];
  

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.newsFeedService.getUserByEmail(user.email).subscribe(
          backendUser => {
            this.userName = backendUser.userName;
            this.isLoggedIn = true;
            console.log('Messages component user: ' + this.userName);
          },
          error => {
            console.error('Error fetching user by email:', error);
          }
        );
      }
    });
    
    //this.sendNotification();
    if (this.notifications.length !== 0) {
      this.listNotifications();
    }
  }

  listNotifications() {
    this.newsFeedService.getNotifications().subscribe(
      notifications => {
        this.notifications = notifications;
        console.log('Notifications:', notifications);
      },
      error => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  sendNotification() {       
    const newNotification = {           
      message: this.message,
      dateCreated: this.dateCreated,
      lastUpdated: this.lastUpdated
    };

    this.newsFeedService.postNotification(newNotification).subscribe(
      response => {
        console.log('Notification sent successfully:', response);
      },
      error => {
        console.error('Error sending notification:', error);
      }
    );
  }

  }
