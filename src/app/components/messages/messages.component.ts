import { Component } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { AuthService } from '@auth0/auth0-angular';
import { NewsfeedService } from '../../services/newsfeed.service';
import { User } from '../../common/user';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, FormsModule, DatePipe, CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  isLoggedIn: boolean = false;
  id: number = 0;
  userName: string = '';  
  messageText: string = '';
  dateCreated: Date = new Date();
  lastUpdated: Date = new Date();
  isEditMode: boolean = false;
  editingMessageId: number = 0;
  originalMessageText: string = '';

  messages: any[] = [];

  constructor(private auth: AuthService, private newsFeedService: NewsfeedService) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.newsFeedService.getUserByEmail(user.email).subscribe(
          backendUser => {
            this.userName = backendUser.userName;
            this.isLoggedIn = true;
            console.log('Messages component user: ' + this.userName);
          },
          error => {
            console.error('Error fetching user by email:', error);
          }
        );
      }
    });

    this.loadMessages();
  }

  sendMessage() {
    if (this.messageText.trim() === '') {
      return;
    }

    if (this.isEditMode) {
      this.saveEditedMessage();      
    } else {
      this.createNewMessage();
    }
  }

  createNewMessage() {
    const newMessage = {
      userName: this.userName,
      messageText: this.messageText,
      dateCreated: new Date(),
      lastUpdated: new Date()
    };

    this.newsFeedService.sendMessage(newMessage).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        this.messageText = '';
        this.loadMessages();
      },
      error => {
        console.error('Error sending message:', error);
      }
    );
  }

  saveEditedMessage() {
    const updatedMessage = {
      id: this.editingMessageId,
      userName: this.userName,
      messageText: this.messageText,
      lastUpdated: new Date(),
      dateCreated: this.dateCreated
    };

    this.newsFeedService.updateMessage(this.editingMessageId, updatedMessage).subscribe(
      response => {
        console.log('Message updated successfully:', response);
        this.loadMessages();
      },
      error => {
        console.error('Error updating message:', error);
      }
    );
  }

  loadMessages() {
    this.newsFeedService.getMessages().subscribe(
      data => {
        this.messages = data;
        console.log('Loaded messages:', this.messages);
      },
      error => {
        console.error('Error loading messages:', error);
      }
    );
  }

  editMessage(message: any) {
    this.isEditMode = true;
    this.editingMessageId = message.id;
    this.originalMessageText = message.messageText;
    this.messageText = message.messageText;
    this.dateCreated = new Date(message.dateCreated);
    const updatedMessage = {
        id: this.id,
        userName: this.userName,
        messageText: this.messageText,
        lastUpdated: this.lastUpdated,
        dateCreated: this.dateCreated
      };
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingMessageId = 0;
    this.messageText = '';
    this.originalMessageText = '';
  }

  deleteMessage(messageId: number) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.newsFeedService.deleteMessage(messageId).subscribe(
        response => {
          console.log('Message deleted successfully:', response);
          this.loadMessages();
        },
        error => {
          console.error('Error deleting message:', error);
        }
      );
    }
  }

  timeElapsed(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minutes ago`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hours ago`;
    }
  }
  }
