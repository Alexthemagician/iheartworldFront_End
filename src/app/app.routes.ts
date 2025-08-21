import { Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GroupsComponent } from './components/groups/groups.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'http://localhost:4200', pathMatch: 'full' },
    //{ path: 'home', component: HomeComponent },
    //{ path: 'groups', component: GroupsComponent },
    //{ path: 'Saved', component: SavedComponent },
    //{ path: 'Favorites', component: FavoritesComponent },
    //{ path: '', redirectTo: '/home', pathMatch: 'full' }
];
