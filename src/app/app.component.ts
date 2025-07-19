import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsFeedComponent } from "./components/news-feed/news-feed.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NewpostComponent } from "./components/newpost/newpost.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { AuthService, AuthModule } from '@auth0/auth0-angular';
import { HomeComponent } from "./components/home/home.component";
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NewsFeedComponent, NavigationComponent, SidebarComponent, UserProfileComponent, AuthModule, HomeComponent, LoginStatusComponent, NewpostComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
[x: string]: any;


  title = 'iheartworld';  
  isLoggedIn = false;

  constructor(private auth: AuthService) {
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isLoggedIn = authenticated;
    });  
  }
}
