import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { NewsfeedService } from '../../services/newsfeed.service';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  constructor(private auth: AuthService, private newsFeedService: NewsfeedService) { }

  isLoggedIn: boolean = false;
  userName: string = '';

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
  }


}
