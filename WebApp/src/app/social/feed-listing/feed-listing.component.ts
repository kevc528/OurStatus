import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from 'src/app/tasks/task.service';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/users/account.service';

@Component({
  selector: 'app-feed-listing',
  templateUrl: './feed-listing.component.html',
  styleUrls: ['./feed-listing.component.css']
})
export class FeedListingComponent implements OnInit {

  @Input() task;
  userId;
  @Output() comments = new EventEmitter<string>();

  constructor(private taskService: TaskService, private cookieService: CookieService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.userId = this.cookieService.get('id');
  }

  likeClicked(): void {
    if (!this.task.likedUsers.includes(this.userId)) {
      this.task.likes += 1;
      this.task.likedUsers.push(this.userId);
      this.taskService.editTask(this.task.id, this.task);
    } else {
      this.task.likes -= 1;
      this.task.likedUsers.splice(this.task.likedUsers.indexOf(this.userId), 1);
      this.taskService.editTask(this.task.id, this.task);
    }
  }
  
  commentClicked(): void {
    this.comments.emit(this.task.id);
  }

}
