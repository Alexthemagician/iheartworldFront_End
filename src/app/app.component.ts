import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { NewsFeedComponent } from "./components/news-feed/news-feed.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NewpostComponent } from "./components/newpost/newpost.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { AuthService, AuthModule } from '@auth0/auth0-angular';
import { HomeComponent } from "./components/home/home.component";
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { CommonModule } from '@angular/common';




// Make sure to install @types/cloudinary if available for better type support
declare const cloudinary: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NewsFeedComponent, NavigationComponent, SidebarComponent, MainPageComponent, AuthModule, HomeComponent, LoginStatusComponent, NewpostComponent, CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
[x: string]: any;


  title = 'iheartworld';  
  isLoggedIn = false;
  baseUrl = new URL('http://localhost:4200');
  
  

  constructor(private auth: AuthService) {
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isLoggedIn = authenticated;
    });  
  }

  
}
