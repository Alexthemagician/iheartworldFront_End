import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NewpostComponent } from '../newpost/newpost.component';
import { NewsfeedService } from '../../services/newsfeed.service';
import { NewpostService } from '../../services/newpost.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent extends NewpostComponent {

  isLoggedIn = false;
  userName: string = '';
  userEmail: string = ''
  userPassword: string = '';
  profileImgUrl: string = '';
  about: string = '';
  email: string = '';
  emailExists: boolean = false;
  isNewUser: boolean = true;
  isLoading: boolean = true;
  override editedImgUrl: string = '';
  editedAbout: string = '';
  id: number = 0;
  

  override myWidget: any;
  override cloudname = "dpevuiym0";
  override uploadPreset = "ml_default";
  override uploadResult: boolean = false;

  isViewingOtherUser: boolean = false;
  viewingUserName: string = '';
  currentUserName: string = '';

  constructor(private route: ActivatedRoute, protected override auth: AuthService,
    protected override newpostService: NewpostService,
    protected override newsFeedService: NewsfeedService,
    protected override dataTransferService: DataTransferService) {
    super(newpostService, auth, newsFeedService, dataTransferService);
  }

  override ngOnInit() {
    this.myWidget = (window as any).cloudinary.createUploadWidget(
      {
      cloudName: this.cloudname,
      uploadPreset: this.uploadPreset,
      cropping: true,
      sources: ['local', 'url', 'camera'],
      multiple: false,
      folder: "iheartworld_storage",
      context: {alt: "user_uploaded"},
      maxImageFileSize: 2000000,
      maxImageWidth: 2000,
      maxVideoFileSize: 100000000,
      thumbnails: '.thumbnails',
      resource_type: 'image'
},
    (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        this.profileImgUrl = result.info.secure_url;// This could be an image or a video URL, named just for simplicity
        this.uploadResult = true;
        console.log('Done! Here is the image info: ', result.info);
        const profileImage = document.querySelector('.profile-picture-preview') as HTMLImageElement;
        if (profileImage) {
          profileImage.src = result.info.secure_url;
        }
                
      }
      if (error) {
        console.error('Profile upload error:', error);
      }
    }
  );

  this.route.params.subscribe(params => {
    const routeUserName = params['userName'];
    if (routeUserName) {
      this.isViewingOtherUser = true;
      this.viewingUserName = routeUserName;
      this.loadOtherUserProfile(routeUserName);
    } else {
      this.isViewingOtherUser = false;
      this.loadMyProfile();
    }
  });   
    
  }

  loadMyProfile() {
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isLoggedIn = authenticated;
      if (authenticated) {
        this.auth.user$.subscribe(user => {
          if (user && user.email) {
            this.userEmail = user.email;
            this.email = user.email;
            this.checkUserExists(user.email);
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  loadOtherUserProfile(username: string) {
    console.log('Loading other user profile for:', username);
    this.isLoading = true;
    this.newsFeedService.getUserByUserName(username).subscribe(
      backendUser => {
        console.log('Loaded other user profile:', backendUser);
        if (backendUser) {
        this.userName = backendUser.userName;
        this.profileImgUrl = backendUser.profileImgUrl;
        this.about = backendUser.about;
        this.email = backendUser.email;
        this.id = backendUser.id;
        this.isLoading = false;
        this.isNewUser = false;
        this.emailExists = true;
        console.log('Loaded profile:', backendUser);
        this.getCurrentUserInfo();
      } else {
        console.error('User not found');
        this.isLoading = false;
      }
      }
    );
  }

  getCurrentUserInfo() {
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.newsFeedService.getUserByEmail(user.email).subscribe(
          currentUser => {
            this.currentUserName = currentUser.userName;
            this.isLoggedIn = true;
          },
          (error) => {
            console.error('Error fetching current user info:', error);
          }
        );
      }
    });
  }

  checkUserExists(email: string) {
    this.newsFeedService.getUserByEmail(email).subscribe(
      backendUser => {
        this.isNewUser = false;
        this.emailExists = true;
        this.userName = backendUser.userName;
        this.currentUserName = backendUser.userName;
        this.profileImgUrl = backendUser.profileImgUrl;
        this.about = backendUser.about;
        this.userPassword = backendUser.userPassword;
        this.id = backendUser.id;
        this.isLoading = false;
        console.log('Existing user found:', backendUser);
      },
      error => {
        this.isNewUser = true;
        this.emailExists = false;
        this.userName = '';
        this.profileImgUrl = '';
        this.about = '';
        this.userPassword = '';
        this.id = 0;
        this.isLoading = false;
        console.log('New user - no backend record found');
      }
    );
  }

  override onSubmit(form: any) {
    if (this.isViewingOtherUser) {
      alert('You cannot edit another user\'s profile.');
      return;
    }

    if (form.valid) {
      this.updateProfile();
    } else {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      alert('Please fill in all required fields.');
    }
  }

    updateProfile() {
       if (this.isViewingOtherUser) {
      alert('You cannot edit another user\'s profile.');
      return;
    }

    if (this.isLoggedIn) {
      const user = {
        userName: this.userName,
        email: this.userEmail,
        about: this.about,
        profileImgUrl: this.profileImgUrl,
        userPassword: this.userPassword
      };
      if (this.isNewUser) {
        this.newsFeedService.postToUsers(user).subscribe((response) => {
          console.log('Profile created successfully:', response);
          alert('Profile created successfully!');
          this.isNewUser = false;
        }, error => {
          console.error('Error creating profile:', error);
          alert('Error creating profile. Please try again.');
        });
      } else {
        const updatedData = {
          id: this.id,
          userName: this.userName,
          email: this.userEmail,
          about: this.about,
          profileImgUrl: this.profileImgUrl,
          userPassword: this.userPassword
        };
        this.newsFeedService.updateUser(updatedData).subscribe((response) => {
          console.log('Profile updated successfully:', response);
          alert('Profile updated successfully!');
        }, (error: any) => {
          console.error('Error updating profile:', error);
          alert('Error updating profile. Please try again.');
        });
      }
    }
    }

    cancelUpdate() {
      if (!this.isViewingOtherUser) {
      this.checkUserExists(this.userEmail);
    }
    }
  }

  

