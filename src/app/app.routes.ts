import { Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GroupsComponent } from './components/groups/groups.component';
import { HomeComponent } from './components/home/home.component';
import { GroupFeedComponent } from './components/group-feed/group-feed.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },        
    { path: 'groups', component: GroupsComponent },
    { path: 'groupfeed/:id', component: GroupFeedComponent },
    { path: 'home', component: HomeComponent },
    //{ path: 'Saved', component: SavedComponent },
    //{ path: 'Favorites', component: FavoritesComponent },
    //{ path: '', redirectTo: '/home', pathMatch: 'full' }
];
