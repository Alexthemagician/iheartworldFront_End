import { Component } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { AuthService, AuthModule } from '@auth0/auth0-angular';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NavigationComponent, AuthModule],
  templateUrl: './user-profile.component.html',
  template: `
    <ul *ngIf="auth.user$ | async as user">
      <li>{{ user.name }}</li>
      <li>{{ user.email }}</li>
    </ul>`,
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  constructor(public auth: AuthService) {}
}
