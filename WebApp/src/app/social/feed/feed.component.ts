import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from 'src/app/tasks/task.service';
import { AccountService } from 'src/app/users/account.service';
import { CookieService } from 'ngx-cookie-service';
import { Task } from 'src/app/shared/model/task';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getUsername } from 'src/app/users/state/user.reducer';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  username;
  accountSubscription;
  usernameSubscription;
  feedSubscription;
  noFriends = false;
  feedTasks: Task[] = [];
  showComment = false;
  mappingSubscription;
  friendIdMap = {};
  commentTaskId = '';

  constructor(private store: Store<State>,private taskService: TaskService, private accountService: AccountService) { 
    }

  ngOnInit(): void {
    this.usernameSubscription = this.store.select(getUsername).subscribe(
      (val) => {
        this.username = val;
        this.accountSubscription = this.accountService.getAccount(this.username).subscribe(
          (res) => {
            if (res.length > 0) {
              let account = res[0];
              if (account.friends.length > 0) {
                this.feedSubscription = this.taskService.getFeedTasks(account.friends).subscribe(
                  (val) => {
                    let tasks = val;
                    let userList = [];
                    val.forEach(
                      task => {
                        userList.push(task.creatorId);
                      }
                    )
                    this.mappingSubscription = this.accountService.getAccountsByIds(userList).subscribe(
                      (val) => {
                        val.forEach(account => {
                          this.friendIdMap[account.id] = account.username;
                        });
                        tasks.forEach(task => {
                          task['creatorUsername'] = this.friendIdMap[task.creatorId];
                        });
                        this.feedTasks = tasks.sort(
                          (a,b) => {
                            let a_date = new Date(a.dateCompleted.seconds * 1000);
                            let b_date = new Date(b.dateCompleted.seconds * 1000);
                            return b_date.valueOf() - a_date.valueOf();
                          }
                        );
                      }
                    )
                  }
                );
              } else {
                this.noFriends = true;
              }
            }
          }
        )
      }
    );
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
    if (this.feedSubscription) {
      this.feedSubscription.unsubscribe();
    }
    if (this.mappingSubscription) {
      this.mappingSubscription.unsubscribe();
    }
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  onCommentSection(taskId: string):void {
    this.showComment = true;
    this.commentTaskId = taskId;
  }

  onBackFeed():void {
    this.showComment = false;
    this.commentTaskId = '';
  }

}
