import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NewpostComponent } from '../newpost/newpost.component';
import { NewsfeedService } from '../../services/newsfeed.service';
import { NewpostService } from '../../services/newpost.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent extends NewpostComponent {

  isLoggedIn = false;
  userName: string = '';
  userEmail: string = ''
  userPassword: string = '';
  profileImgUrl: string = '';
  about: string = '';
  email: string = '';
  emailExists: boolean = false;

  

  override ngOnInit() {
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isLoggedIn = authenticated;
      if (authenticated) {
        this.auth.user$.subscribe(user => {
          if (user && user.email) {
            this.userEmail = user.email;
            this.emailExists = true;
            this.newsFeedService.getUserByEmail(user.email).subscribe(
              backendUser => {
                this.userName = backendUser.userName;
                this.profileImgUrl = backendUser.profileImgUrl;
                this.about = backendUser.about;
                this.userPassword = backendUser.userPassword;
                this.email = backendUser.email;
              });
          }
        });
      }
    });
  }

    updateProfile() {
      if (this.isLoggedIn) {
        const user = {
          name: this.userName,
          email: this.userEmail,
          about: this.about,
          profileImgUrl: this.profileImgUrl,
          userPassword: this.userPassword
        };
        this.newsFeedService.postToUsers(user).subscribe((response) => {
          console.log('Profile updated successfully:', response);
        });
      }
    }

  
}
