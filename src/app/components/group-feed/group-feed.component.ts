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
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../common/user';
import { AuthService } from '@auth0/auth0-angular';
import { GrouppostComponent } from "../grouppost/grouppost.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, NavigationComponent, SidebarComponent, MatButtonModule, MatMenuModule, GrouppostComponent],
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
  memberName: string = '';
  memberId: number = 0;
  dateCreated: Date = new Date();
  userId: string = '';
  isModalVisible = false;
  isEditMode: boolean = false;
  postCategory: string = '';
  postTitle: string = '';
  editedCategory: string = '';
  editedTitle: string = '';
  postText: string = '';
  editedText: string = '';
  editedImgUrl: string = '';
  editedVideoUrl: string = '';
  editedDateCreated: Date = new Date();
  editedPostId: number = 0;
  isMember: boolean = false;

  constructor(public dataTransferService: DataTransferService, private route: ActivatedRoute, private newsFeedService: NewsfeedService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const groupId = +params['id']; // Convert string to number
      if (groupId) {
        this.loadGroupById(groupId);
        this.loadGroupMembers(groupId);        
      }
    });
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.newsFeedService.getUserByEmail(user.email).subscribe(
          backendUser => {
            this.userId = backendUser.userName;
            if (this.userId) {
          this.isMember = this.members.includes(this.userId);          
        }                                   
          },
          error => {
            console.error('Error fetching user from backend:', error);
          }
        );
      }
    });
        
  }

  userIdMatch(tempNewsFeed: any): boolean {
    if (this.userId === tempNewsFeed.userId) {
      return true;
    } else {
      return false;
    }
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
        this.sendNewPostData();
        
        // Load group feeds after groupId is set
        this.listGroupFeeds();
        
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
        this.members = [...new Set(data)];
        this.checkMembershipStatus();       
      },
      error => {
        console.error('Error fetching group members:', error);
      }
    );
  }

  onGroupSelected(selectedGroupId: number) {
    this.loadGroupById(selectedGroupId);
  }

  private checkMembershipStatus() {
  if (this.userId && this.members.length >= 0) {
    this.isMember = this.members.includes(this.userId);
    console.log('Membership status check - User:', this.userId, 'Is member:', this.isMember, 'Members:', this.members);
  }
}

  joinGroup() {
    if (!this.isMember && this.userId) {

      if (this.members.includes(this.userId)) {
      console.log('User is already a member');
      this.isMember = true;
      return;
    }
      const newMember = {
        groupId: this.groupId,
        memberName: this.userId,        
      };
      this.dataTransferService.addMemberToGroup(newMember).subscribe({
        next: (response) => {
          console.log('Successfully joined the group:', response);

          if (!this.members.includes(this.userId)) {
            this.members.push(this.userId);
          }
          this.isMember = true;
          this.loadGroupMembers(this.groupId);
        
        alert('Successfully joined the group!');
        },
        error: (error) => {
          console.error('Error joining the group:', error);
        }
      });
    } else if (this.isMember) {
    
    this.leaveGroup();
  } else {
    console.error('Cannot join group: User ID not available');
    alert('Please log in to join the group.');
  }


  }

  leaveGroup() {
    if (this.isMember && this.userId) {
      console.log('Leaving group:', this.groupId, 'User:', this.userId);
            
      this.dataTransferService.removeMemberFromGroup(this.groupId, this.userId).subscribe({
        next: (response) => {
          console.log('Successfully left the group:', response);
          this.members = this.members.filter(member => member !== this.userId);
          this.isMember = false;
          this.loadGroupMembers(this.groupId);
          alert('Successfully left the group!');
        },
        error: (error) => {
          console.error('Error leaving the group:', error);
          console.error('Error details:', error.error);
          alert('Failed to leave the group. Please try again.');
        }
      });
    }
  }

  

      

  listGroupFeeds() {
    console.log('Loading group feeds for groupId:', this.groupId);
    this.newsFeedService.getGroupFeedById(this.groupId).subscribe(
      data=> {
        this.groupFeeds = data;
        console.log('Group feeds loaded:', this.groupFeeds);
        console.log('Number of posts for this group:', this.groupFeeds.length);

        const filteredFeeds = data.filter((feed: any) => {
        const feedGroupId = feed.groupId || (feed as any).groupId;
        console.log('Post groupId:', feedGroupId, 'Current groupId:', this.groupId);
        return feedGroupId === this.groupId;
      });
      
      this.groupFeeds = filteredFeeds;
      console.log('Filtered group feeds:', this.groupFeeds);
      console.log('Number of posts for group', this.groupId + ':', this.groupFeeds.length);
      
      // Debug: Show all groupIds in the response
      data.forEach((feed: any, index: number) => {
        console.log(`Post ${index + 1}: groupId = ${feed.groupId || (feed as any).groupId}`);
      });
    },
    error => {
      console.error('Error loading group feeds:', error);
    }
  );



    
  }

  editPost(tempGroupFeed: any) {
    
    this.isEditMode = true;
    const match = tempGroupFeed._links?.self?.href.match(/\/(\d+)$/);
    const postId = match ? parseInt(match[1], 10) : null;    
    this.postText = tempGroupFeed.postText;
    this.postTitle = tempGroupFeed.postTitle;
    this.postCategory = tempGroupFeed.postCategory;
    const editedText = this.postText;
    this.editedText = editedText;
    const editedTitle = this.postTitle;
    this.editedTitle = editedTitle;
    const editedCategory = this.postCategory;
    this.editedCategory = editedCategory;
    const editedImgUrl = tempGroupFeed.postImgUrl;
    this.editedImgUrl = editedImgUrl;
    const editedVideoUrl = tempGroupFeed.postVideoUrl;
    this.editedVideoUrl = editedVideoUrl;
    const editedDateCreated = tempGroupFeed.dateCreated;
    this.editedDateCreated = editedDateCreated;
    if (postId!== null) {
    this.editedPostId = postId;
    }
    console.log(postId);
    console.log(editedText);    
    
    this.sendData();
          
    this.isModalVisible = true;
            
    
  }
  
  sendData() {
    const data = {
        editedCategory: this.editedCategory,
        editedTitle: this.editedTitle,
        editedText: this.editedText,
        isEditMode: this.isEditMode,
        editedPostId: this.editedPostId,
        editedImgUrl: this.editedImgUrl,
        editedVideoUrl: this.editedVideoUrl,
        editedDateCreated: this.editedDateCreated,
        groupId: this.groupId
      };
      console.log('Sending data with groupId:', this.groupId); 
      this.dataTransferService.changeData(data);
  }

  sendNewPostData() {
    const data = {
      isEditMode: false,
      groupId: this.groupId
    };

    console.log('Sending new post data with groupId:', this.groupId); 
    this.dataTransferService.changeData(data);
  }

  deletePost(tempGroupFeed: any) {    
    const match = tempGroupFeed._links?.self?.href.match(/\/(\d+)$/);
    const postId = match ? parseInt(match[1], 10) : null;
    console.log(postId);
    console.log(match);
    if (postId === parseInt(match[1], 10) && postId!== null) {      
          this.newsFeedService.deleteGroupPost(postId).subscribe(
            response => {
              console.log('Post deleted successfully:', response);
              this.listGroupFeeds();
            },
            error => {
              console.error('Error deleting post:', error);
            }
          );         
                         
    }
  }

  showModal() {
    this.isModalVisible = true;
    this.isEditMode = false; 
    this.sendNewPostData(); 
  }

  hideModal() {
    this.isEditMode = false;
    this.isModalVisible = false;
  }

  navigateToProfile(userName: string) {
    this.router.navigate(['/profile', userName]);
  }
}
