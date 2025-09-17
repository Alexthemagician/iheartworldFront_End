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

  /* override postNewPost() {
    if (this.isGroupPost) {
      if (this.isEditMode) {
        if (this.chooseNewImage && this.uploadResult === true) {
          if (this.postImgUrl.split('.').pop() === 'mp4') {
            this.postVideoUrl = this.postImgUrl;
            this.postImgUrl = '';
            
          }
          const fullyEditedPostData = {
            postText: this.postText,
            postImgUrl: this.postImgUrl,
            postVideoUrl: this.postVideoUrl,
            dateCreated: this.editedDateCreated,
            userId: this.userId,
            postId: this.editedPostId,
          }
          this.newpostService.updateGroupPost(fullyEditedPostData).subscribe(
          response => {
            console.log('Post updated successfully:', response);
            // Optionally reset form fields here
            this.postText = '';
            this.postImgUrl = '';
            this.postVideoUrl = '';
            this.isEditMode = false;
            //NewsFeedComponent.editedText = '';          
            this.close.emit();
          }
          ,
          error => {
            console.error('Error updating post:', error);
          }
        );
        } else {
        const editedPostData = {
          postText: this.postText,
          postImgUrl: this.editedImgUrl,
          postVideoUrl: this.editedVideoUrl,
          dateCreated: this.editedDateCreated,
          userId: this.userId,
          postId: this.editedPostId,        
        }    
        this.newpostService.updateGroupPost(editedPostData).subscribe(
          response => {
            console.log('Post updated successfully:', response);
            // Optionally reset form fields here
            this.postText = '';
            this.postImgUrl = '';
            this.postVideoUrl = '';
            this.isEditMode = false;
            //NewsFeedComponent.editedText = '';          
            this.close.emit();
          }
          ,
          error => {
            console.error('Error updating post:', error);
          }
        );
        }
        } else {
        if (this.postImgUrl.split('.').pop() === 'mp4') {
              this.postVideoUrl = this.postImgUrl;
              this.postImgUrl = '';          
            }
        const postData = {
          postText: this.postText,
          postImgUrl: this.postImgUrl,
          postVideoUrl: this.postVideoUrl,
          userId: this.userId,
        };
        this.newpostService.postToGroupFeed(postData).subscribe(
          response => {
            console.log('Post successful:', response);
            // Optionally reset form fields here
            this.postText = '';
            this.postImgUrl = '';
            this.postVideoUrl = '';
            this.close.emit();
            //this.user = 'worldmaster';
          },
          error => {
            console.error('Error posting:', error);
          }
        );
      }   

    }
  }
 */

}
