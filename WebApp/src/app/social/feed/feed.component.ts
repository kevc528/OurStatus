import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from 'src/app/tasks/task.service';
import { AccountService } from 'src/app/users/account.service';
import { CookieService } from 'ngx-cookie-service';
import { Task } from 'src/app/shared/model/task';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getUsername, getUserId } from 'src/app/users/state/user.reducer';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  accountSubscription;
  userIdSubscription;
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
    this.userIdSubscription = this.store.select(getUserId).subscribe(
      (userId) => {
        if (userId != null) {
          let sub = this.accountService.findFriends(userId).subscribe(
            (friends) => {
              sub.unsubscribe();
              if (friends.length > 0) {
                this.noFriends = false;
                let friendIds: string[] = friends.map(friendship => {
                  if (friendship.firstId == userId) {
                    return friendship.secondId;
                  } else {
                    return friendship.firstId;
                  }
                })
                this.feedSubscription = this.taskService.getFeedTasks(friendIds).subscribe(
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
          )
        }
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
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
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
