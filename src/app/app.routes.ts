import { Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GroupsComponent } from './components/groups/groups.component';
import { HomeComponent } from './components/home/home.component';
import { GroupFeedComponent } from './components/group-feed/group-feed.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
    { path: '', component: ProfileComponent },        
    { path: 'groups', component: GroupsComponent },
    { path: 'groupfeed/:id', component: GroupFeedComponent },
    { path: 'home', component: HomeComponent },
    { path: 'messages', component: MessagesComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
    { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
    //{ path: 'Saved', component: SavedComponent },
    //{ path: 'Favorites', component: FavoritesComponent },
    //{ path: '', redirectTo: '/home', pathMatch: 'full' }
];
