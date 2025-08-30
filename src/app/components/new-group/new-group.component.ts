import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { Group } from '../../common/group';
import { User } from '../../common/user';
import { AuthService } from '@auth0/auth0-angular';
import { DataTransferService } from '../../services/data-transfer.service';
import { NewpostComponent } from '../newpost/newpost.component';

@Component({
  selector: 'app-new-group',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-group.component.html',
  styleUrl: './new-group.component.css',
  providers: [DataTransferService]
})
export class NewGroupComponent extends NewpostComponent implements OnInit {
  groupName: string = '';
  groupId: any;
  groupDescription: string = '';
  groupImgUrl: string = '';
  membersList: User[] = [];
  
  dateCreated: Date = new Date();
  isModalVisible: boolean = true;
  groupList: Group[] = [];
  
  
  private groupUrl = 'http://localhost:8080/api/groups';   
  
  get groupAdmin(): string {
    return this.userId;
  }
  
  addNewGroup() {
    const newGroup: Group = { 
      groupId: 0, // Backend will assign the ID     
      groupName: this.groupName,
      groupDescription: this.groupDescription,
      groupImgUrl: this.postImgUrl,
      membersList: this.membersList,
      groupAdmin: this.userId,
      dateCreated: this.dateCreated
    };    

    this.dataTransferService.postGroupData(newGroup).subscribe(
      response => {
        console.log('Group created successfully:', response);
        this.closeGroupModal();
      },
      error => {
        console.error('Error creating group:', error);
      }
    );
  }

  closeGroupModal() {
    this.isModalVisible = false;
    console.log(this.groupAdmin);    
    this.close.emit();
  }

}
