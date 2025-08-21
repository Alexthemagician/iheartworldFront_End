import { Component } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { AuthService, AuthModule } from '@auth0/auth0-angular';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NewsFeedComponent } from "../news-feed/news-feed.component";
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NavigationComponent, AuthModule, SidebarComponent, NewsFeedComponent, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './main-page.component.html',
  template: `
    <ul *ngIf="auth.user$ | async as user">
      <li>{{ user.name }}</li>
      <li>{{ user.email }}</li>
    </ul>`,
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

  constructor(public auth: AuthService) {}
}
