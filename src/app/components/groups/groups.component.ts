import { Component } from '@angular/core';
import { Group } from '../../common/group';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NewsFeedComponent } from '../news-feed/news-feed.component';
import { NewGroupComponent } from '../new-group/new-group.component';



@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, NavigationComponent, SidebarComponent, NewsFeedComponent, NewGroupComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {

  groupList: Group[] = [];
  isModalVisible: boolean = false;

  constructor() { }

  openCreateGroupModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }

}
