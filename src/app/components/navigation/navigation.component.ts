import { Component, Inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, AuthModule } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from "@angular/router";


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, AuthModule, RouterLink, RouterOutlet],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private auth: AuthService,
    private router: Router
  ) {
    this.auth.isAuthenticated$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
        if (!loggedIn) {
          this.router.navigate(['/home']);
        }
      }

    );
  }

  isLoggedIn: boolean = false;
  isLoggedOut: boolean = true;
  

  Login() {
    this.auth.loginWithRedirect();
    
  }

  Logout() {
    this.auth.logout({ 
      logoutParams: {
        returnTo: this.document.location.origin 
      }
    });

    this.router.navigate(['/home']);
    
  }
}