import { Component } from '@angular/core';
import { NewpostComponent } from '../newpost/newpost.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-grouppost',
  standalone: true,
  imports: [],
  templateUrl: './grouppost.component.html',
  styleUrl: './grouppost.component.css'
})



export class GrouppostComponent extends NewpostComponent {

  postComponent!: NewpostComponent;
  isGroupPost: boolean = true;
  groupId: number = 0;

  override postNewPost() {
    
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
        this.newpostService.updateUserPost(fullyEditedPostData).subscribe(
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
      this.newpostService.updateUserPost(editedPostData).subscribe(
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
  this.newpostService.postToNewsFeed(postData).subscribe(
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
