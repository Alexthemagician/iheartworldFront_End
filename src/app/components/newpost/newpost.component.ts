import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Image } from '../../common/image';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NewpostService } from '../../services/newpost.service';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';


declare const cloudinary: any;

@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
  
  
  
  constructor(private newpostService: NewpostService,
    private auth: AuthService,
  ) {
  }

  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.postText = '';    
    this.close.emit();
    
  }
  

  ngOnInit() {
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
      thumbnails: '.thumbnails'
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
  }

  postNewPost() {
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
