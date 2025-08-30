import { Component } from '@angular/core';
import { Group } from '../../common/group';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NewsFeedComponent } from '../news-feed/news-feed.component';
import { NewGroupComponent } from '../new-group/new-group.component';
import { DataTransferService } from '../../services/data-transfer.service';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, NavigationComponent, SidebarComponent, NewsFeedComponent, NewGroupComponent, RouterLink],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
  providers: [DataTransferService]
})
export class GroupsComponent {

  groupList: Group[] = [];
  isModalVisible: boolean = false;
  groupId: number = 0;
  groupName: string = '';
  groupDescription: string = '';
  groupImgUrl: string = '';
  membersList: any[] = [];
  dateCreated: Date = new Date();

  constructor(private dataTransferService: DataTransferService) { }

  ngOnInit(): void {
    this.listAllGroups();
    console.log(this.groupList.map(group => this.groupId));
  }
  
  openCreateGroupModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }

  listAllGroups() {
    this.dataTransferService.getGroups().subscribe(
      data => {
        this.groupList = data;        
        console.log('Groups fetched successfully:', this.groupList);        
      },
      error => {      
        console.error('Error fetching groups:', error);
      }
    );

  }

  loadGroupById(groupId: number) {
    this.dataTransferService.getGroupById(groupId).subscribe(
      data => {
        this.groupId = data.groupId;
        this.groupName = data.groupName;
        this.groupDescription = data.groupDescription;
        this.groupImgUrl = data.groupImgUrl;
        this.membersList = data.membersList;
        this.dateCreated = data.dateCreated;
        console.log('Group details fetched successfully:', data);
      },
      error => {
        console.error('Error fetching group details:', error);
      }
    );
  }

  onGroupSelected(selectedGroupId: number) {
    this.loadGroupById(selectedGroupId);
  }

}
