import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Image } from '../../common/image';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NewpostService } from '../../services/newpost.service';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { NewsFeedComponent } from '../news-feed/news-feed.component';
import { NewsfeedService } from '../../services/newsfeed.service';


declare const cloudinary: any;

@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [FormsModule, CommonModule, NewsFeedComponent],  
  templateUrl: './newpost.component.html',
  styleUrl: './newpost.component.css'
})
export class NewpostComponent {



[x: string]: any;
cloudname = "dpevuiym0";
  uploadPreset = "ml_default";
  myWidget: any;
  private baseUrl = 'http://localhost:8080/api/userPosts';
  
  postImgUrl: string = '';
  userId: string = '';  
  postText: string = '';
  postVideoUrl: string = '';
  isEditMode: boolean = NewsFeedComponent.isEditMode;
  editedText: string = NewsFeedComponent.editedText;
  editedPostId: number = NewsFeedComponent.editedPostId;
  editedImgUrl: string = NewsFeedComponent.editedImgUrl;
  editedVideoUrl: string = NewsFeedComponent.editedVideoUrl;
  editedDateCreated: Date = NewsFeedComponent.editedDateCreated;
  chooseNewImage: boolean = false;
  
  
  
  constructor(private newpostService: NewpostService,
    private auth: AuthService,
    private newsFeedService: NewsfeedService) { }

  @Output() close = new EventEmitter<void>();

  closeModal(): void {   
    this.isEditMode = false; 
    this.postText = '';    
    this.close.emit();
    
  }
  

  ngOnInit() {
    if (this.isEditMode) {
      this.postText = this.editedText;      
    }

    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.newpostService.getUserByEmail(user.email).subscribe(
          backendUser => {
            this.userId = backendUser.userName;                        
          },
          error => {
            console.error('Error fetching user from backend:', error);
          }
        );
      }
    });


    this.myWidget = (window as any).cloudinary.createUploadWidget(
      {
      cloudName: this.cloudname,
      uploadPreset: this.uploadPreset,
      cropping: true,
      sources: ['local', 'url', 'camera'],
      multiple: true,
      folder: "iheartworld_storage",
      context: {alt: "user_uploaded"},
      maxImageFileSize: 2000000,
      maxImageWidth: 2000,
      maxVideoFileSize: 100000000,
      thumbnails: '.thumbnails',
      resource_type: 'auto'
},
    (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        this.postImgUrl = result.info.secure_url;
        console.log('Done! Here is the image info: ', result.info);
        const uploadedImage = document.getElementById('uploadedimage');
        const uploadedVideo = document.getElementById('uploadedvideo');
        if (uploadedVideo) {
          uploadedVideo.setAttribute('src', result.info.secure_url);
        }
        if (uploadedImage) {
          uploadedImage.setAttribute('src', result.info.secure_url);          
          
           
        }
      }
    }
    );
  }

  openWidget() {
    this.myWidget.open();
    if (this.isEditMode) {
      this.chooseNewImage = true;
    }
  }

  postNewPost() {    

    if (NewsFeedComponent.isEditMode) {
      if (this.chooseNewImage) {
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
