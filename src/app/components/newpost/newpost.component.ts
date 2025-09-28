import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Image } from '../../common/image';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NewpostService } from '../../services/newpost.service';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

import { NewsfeedService } from '../../services/newsfeed.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { Basepostcomponent, PostData } from '../../common/basepostcomponent';


declare const cloudinary: any;

@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [FormsModule, CommonModule, ],  
  templateUrl: './newpost.component.html',
  styleUrl: './newpost.component.css'
})
export class NewpostComponent extends Basepostcomponent{   

  constructor( protected override newpostService: NewpostService,
        protected override auth: AuthService,
        protected override newsFeedService: NewsfeedService,
        protected override dataTransferService: DataTransferService
      ) { super(newpostService, auth, newsFeedService, dataTransferService); }

  protected create(d: PostData) { return this.newpostService.postToNewsFeed(d); }
  protected update(d: PostData) { return this.newpostService.updateUserPost(d); }   

  onSubmit(form: any) {
    if (!form.valid) {      
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }
    
}

