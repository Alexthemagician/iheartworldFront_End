import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NavigationComponent } from '../navigation/navigation.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  currentTheme: string = 'light';
  private themeSubscription: Subscription = new Subscription();

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  getThemeButtonLabel() {
    return this.currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}
