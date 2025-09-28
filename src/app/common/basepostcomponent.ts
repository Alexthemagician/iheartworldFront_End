import { EventEmitter, Output, Directive } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from '@auth0/auth0-angular';
import { DataTransferService } from "../services/data-transfer.service";
import { NewpostService } from "../services/newpost.service";
import { NewsfeedService } from "../services/newsfeed.service";
import { OnInit } from "@angular/core";

export interface PostData {
    postCategory: string;
    postTitle: string;
    postText: string;
    postImgUrl: string;
    postVideoUrl: string;
    dateCreated: Date;
    userId: string;
    postId?: number;
    groupId?: number;
}



@Directive()
export abstract class Basepostcomponent implements OnInit {
    postCategory: string = '';
    postTitle: string = '';
    postText: string = '';
    postImgUrl: string = '';
    postVideoUrl: string = '';
    userId: string = '';
    isEditMode: boolean = false;
    editedCategory: string = '';
    editedTitle: string = '';
    editedText: string = '';
    editedPostId: number = 0
    editedImgUrl: string = '';
    editedVideoUrl: string = ''
    editedDateCreated: Date = new Date();
    chooseNewImage: boolean = false;
    groupId: number = 0; 

    receivedData: any;
    receivedGroupData: any;
    [x: string]: any;
    cloudname = "dpevuiym0";
    uploadPreset = "ml_default";
    myWidget: any;
    private baseUrl = 'http://localhost:8080/api/userPosts';
    uploadResult: boolean = false;

    constructor(protected newpostService: NewpostService,
        protected auth: AuthService,
        protected newsFeedService: NewsfeedService,
        protected dataTransferService: DataTransferService
      ) { }

    protected abstract create(postData: PostData): Observable<any>;
    protected abstract update(postData: PostData): Observable<any>;

    @Output() close = new EventEmitter<void>();
    
      closeModal(): void {   
        this.isEditMode = false; 
        this.postText = ''; 
        this.postTitle = '';
        this.postCategory = '';   
        this.close.emit();
        
      }

    ngOnInit() {
    if (this.isEditMode) {
      this.postText = this.editedText;
      this.postTitle = this.editedTitle;
      this.postCategory = this.editedCategory;      
    }

    this.dataTransferService.currentData.subscribe(data => {
      this.receivedData = data;
      if (this.receivedData) {
        this.isEditMode = this.receivedData.isEditMode;
        this.editedCategory = this.receivedData.editedCategory;
        this.editedTitle = this.receivedData.editedTitle;
        this.editedText = this.receivedData.editedText;
        this.editedPostId = this.receivedData.editedPostId;
        this.editedImgUrl = this.receivedData.editedImgUrl;
        this.editedVideoUrl = this.receivedData.editedVideoUrl;
        this.editedDateCreated = this.receivedData.editedDateCreated;
        this.groupId = this.receivedData.groupId;
        if (this.isEditMode) {
          this.postText = this.editedText;
          this.postTitle = this.editedTitle;
          this.postCategory = this.editedCategory;
        }
      }
    });    

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
        this.postImgUrl = result.info.secure_url;// This could be an image or a video URL, named just for simplicity
        this.uploadResult = true;
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

    protected isVideo(url: string | null | undefined) {
        return url?.includes('video') ?? false; //checking if the url contains 'video'
    }

    postNewPost() { 
        if (this.isVideo(this.postImgUrl)) {
            this.postVideoUrl = this.postImgUrl;
            this.postImgUrl = '';
        }

        console.log('Basepostcomponent - groupId value:', this.groupId); // Debug log

        const baseData: PostData = {
        postText: this.postText,
        postCategory: this.postCategory,
        postTitle: this.postTitle,
        postImgUrl: this.isEditMode && !this.chooseNewImage ? this.editedImgUrl : this.postImgUrl,
        postVideoUrl: this.isEditMode && !this.chooseNewImage ? this.editedVideoUrl : this.postVideoUrl,
        userId: this.userId,
        dateCreated: this.isEditMode ? this.editedDateCreated : new Date(),
        postId: this.isEditMode ? this.editedPostId : undefined,
        groupId: this.groupId
    };

        console.log('Basepostcomponent - final postData:', baseData); // Debug log


    const op$ = this.isEditMode ? this.update(baseData) : this.create(baseData);
    return op$.subscribe({
        next: (response) => {
            console.log('Post successful:', response);
            this.resetForm();
            this.closeModal();
        },
        error: (err) => {
            console.error('Post failed:', err);            
            alert('Failed to submit post. Please try again.');
        }        
    });

        
  }

  protected resetForm() {
        this.postCategory = '';
        this.postTitle = '';
        this.postText = '';
        this.postImgUrl = '';
        this.postVideoUrl = '';
        this.isEditMode = false;
    }

}
