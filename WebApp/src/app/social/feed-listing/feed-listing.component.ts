import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TaskService } from 'src/app/tasks/task.service';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/users/account.service';
import { Task } from 'src/app/shared/model/task';
import { Store } from '@ngrx/store';
import { State, getUserId } from 'src/app/users/state/user.reducer';

@Component({
  selector: 'app-feed-listing',
  templateUrl: './feed-listing.component.html',
  styleUrls: ['./feed-listing.component.css']
})
export class FeedListingComponent implements OnInit, OnDestroy {

  @Input() task: Task;
  userId;
  sub;
  @Output() comments = new EventEmitter<string>();

  constructor(private store: Store<State>,private taskService: TaskService) { }

  ngOnInit(): void {
    this.sub = this.store.select(getUserId).subscribe(
      val => {
        this.userId = val;
      }
    )
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
