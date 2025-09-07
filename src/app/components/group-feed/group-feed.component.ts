import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTransferService } from '../../services/data-transfer.service';
import { Group } from '../../common/group';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavigationComponent } from "../navigation/navigation.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Groupfeed } from '../../common/groupfeed';
import { NewsfeedService } from '../../services/newsfeed.service';

@Component({
  selector: 'app-group-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, NavigationComponent, SidebarComponent],
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.css'],
  providers: [DataTransferService]
})
export class GroupFeedComponent implements OnInit {

  groupList: Group[] = [];
  groupFeeds: Groupfeed[] = [];
  groupId: number = 0; 
  groupName: string = '';
  groupDescription: string = '';
  groupImgUrl: string = '';
  members: string[] = [];
  dateCreated: Date = new Date();

  constructor(public dataTransferService: DataTransferService, private route: ActivatedRoute, private newsFeedService: NewsfeedService) {}

  ngOnInit(): void {
    this.listGroupFeeds();
    this.route.params.subscribe(params => {
      const groupId = +params['id']; // Convert string to number
      if (groupId) {
        this.loadGroupById(groupId);
        this.loadGroupMembers(groupId);
      }
    });
        
  }

  listAllGroups() {
    this.dataTransferService.getGroups().subscribe(
      data => {
        this.groupList = data;        
        console.log('Groups fetched successfully:', this.groupList);
        console.log(this.groupId);
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
        this.dateCreated = data.dateCreated;
        console.log('Group details fetched successfully:', data);        
      },
      error => {
        console.error('Error fetching group details:', error);
      }
    );
  }

  private loadGroupMembers(groupId: number) {
    this.dataTransferService.getMembersOfGroup(groupId).subscribe(
      data => {
        this.members = data;        
      },
      error => {
        console.error('Error fetching group members:', error);
      }
    );
  }

  onGroupSelected(selectedGroupId: number) {
    this.loadGroupById(selectedGroupId);
  }

  joinGroup() {
    this.dataTransferService.addMemberToGroup(this.groupId, 'currentUser').subscribe(
      response => {
        console.log('Successfully joined the group:', response);
        // Optionally, update the members list or provide feedback to the user
      },
      error => {
        console.error('Error joining the group:', error);
      }
    );
  }

  listGroupFeeds() {
    this.newsFeedService.getGroupFeed().subscribe(
      data=> {
        this.groupFeeds = data;
        console.log(this.groupFeeds);
      }
    ) 
  }
}
