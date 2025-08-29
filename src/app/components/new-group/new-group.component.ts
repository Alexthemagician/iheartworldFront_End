import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { Group } from '../../common/group';
import { User } from '../../common/user';
import { AuthService } from '@auth0/auth0-angular';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-new-group',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-group.component.html',
  styleUrl: './new-group.component.css',
  providers: [DataTransferService]
})
export class NewGroupComponent implements OnInit {
  groupName: string = '';
  groupId: number = 0;
  groupDescription: string = '';
  groupImgUrl: string = '';
  membersList: User[] = [];
  groupAdmin: string = '';
  dateCreated: Date = new Date();
  isModalVisible: boolean = true;
  groupList: Group[] = [];
  userId: string = '';

   @Output() close = new EventEmitter<void>();

   constructor(private auth: AuthService, private dataTransferService: DataTransferService) { }

   closeModal(): void {
    this.isModalVisible = false;    
    this.close.emit();
   }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.dataTransferService.getUserByEmail(user.email).subscribe(
          backendUser => {
            this.userId = backendUser.userName;
            this.groupAdmin = this.userId;
          }
        );
      }
    });
  }

  addNewGroup() {
    const newGroup: Group = {
      groupId: this.groupList.length + 1,
      groupName: this.groupName,
      groupDescription: this.groupDescription,
      groupImgUrl: this.groupImgUrl,
      membersList: this.membersList,
      groupAdmin: this.groupAdmin,
      dateCreated: this.dateCreated
    };
    this.groupList.push(newGroup);
    this.groupName = '';
  }

  closeGroupModal() {
    this.isModalVisible = false;
    console.log(this.groupAdmin);
    this.close.emit();
  }

}
