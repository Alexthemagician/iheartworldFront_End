import { Component } from '@angular/core';
import { NewpostComponent } from '../newpost/newpost.component';
import { CommonModule } from '@angular/common';
import { GrouppostComponent } from '../grouppost/grouppost.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { DataTransferService } from '../../services/data-transfer.service';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { NewsfeedService } from '../../services/newsfeed.service';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NewpostComponent, CommonModule, RouterLink, RouterOutlet, GrouppostComponent, SearchBarComponent, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  receivedData: any;
  isModalVisible = false;
  isNewsFeedVisible = true;
  postText: string = '';
  isEditMode: boolean = false;
  editedText: string = '';
  editedPostId: number = 0;
  editedImgUrl: string = '';
  editedVideoUrl: string = '';
  editedDateCreated: Date = new Date();
  isGroupModalVisible = false;
  pathname: string = window.location.pathname;
  pathMatch: RegExp = /^\/groupfeed(\/\d+)?$/;

  userId: string = '';
  members: string[] = [];
  isMember: boolean = false;
  isGroupPost: boolean = false;
  memberName: string = '';

  constructor(private dataTransferService: DataTransferService, private auth: AuthService, private newsFeedService: NewsfeedService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.dataTransferService.currentData.subscribe(data => {
      this.receivedData = data;
      if (this.receivedData) {
        this.isEditMode = this.receivedData.isEditMode;
        this.editedText = this.receivedData.editedText;
        this.editedPostId = this.receivedData.editedPostId;
        this.editedImgUrl = this.receivedData.editedImgUrl;
        this.editedVideoUrl = this.receivedData.editedVideoUrl;
        this.editedDateCreated = this.receivedData.editedDateCreated;
        if (this.isEditMode) {
          this.postText = this.editedText;          
        }
        if (this.pathname.match(this.pathMatch)) {
          this.isGroupPost = true;
        }
      }
    });

    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.newsFeedService.getUserByEmail(user.email).subscribe(
          backendUser => {
            this.userId = backendUser.userName;
            if (this.userId) {
          this.isMember = this.members.includes(this.userId);
          console.log('User ID:', this.userId);
          console.log('Member?', this.isMember);
        }
      },
      error => {
        console.error('Error fetching user from backend:', error);
      }
    );
      
      }
    });
    
    this.route.params.subscribe(params => {
      const groupId = +params['id'];
    console.log('Current Group ID:', groupId);
    this.dataTransferService.getMemberId(groupId, this.userId).subscribe(members => {
      this.members = members.map((member: any) => member.memberName);
      console.log('Group Members:', this.members);
    });
  });

    
    
  }
    

  showModal() {
    //if statement to show group post modal
    if (this.pathname.match(this.pathMatch)) {      
      this.isGroupModalVisible = true;
      
    }
    else {
      this.isModalVisible = true;
    }
  }

  hideModal() {
    this.isModalVisible = false;
  }

  hideGroupModal() {
    this.isGroupModalVisible = false;
  }

  hideNewsFeed() {
    this.isNewsFeedVisible = false;
  }

  isUserIdMember(): boolean {
    return this.isMember;
  }
  
}
