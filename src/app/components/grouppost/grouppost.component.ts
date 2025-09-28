import { Component, Input } from '@angular/core';
import { NewpostComponent } from '../newpost/newpost.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Basepostcomponent, PostData } from '../../common/basepostcomponent';
import { AuthService } from '@auth0/auth0-angular';
import { NewsfeedService } from '../../services/newsfeed.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { NewpostService } from '../../services/newpost.service';

@Component({
  selector: 'app-grouppost',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grouppost.component.html',
  styleUrl: './grouppost.component.css'
})



export class GrouppostComponent extends Basepostcomponent {

  postComponent!: NewpostComponent;
  isGroupPost: boolean = true;
  

  constructor( protected override newpostService: NewpostService,
        protected override auth: AuthService,
        protected override newsFeedService: NewsfeedService,
        protected override dataTransferService: DataTransferService
      ) { super(newpostService, auth, newsFeedService, dataTransferService); }

  protected create(d: PostData) { 
    console.log('PostData being sent:', {...d, groupId: this.groupId});
    return this.newpostService.postToGroupFeed({...d, groupId: this.groupId});
 }
  protected update(d: PostData) { 
    console.log('PostData being sent for update:', {...d, groupId: this.groupId});
    return this.newpostService.updateGroupPost({...d, groupId: this.groupId}); }  

    onSubmit(form: any) {
    if (!form.valid) {      
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }
}
