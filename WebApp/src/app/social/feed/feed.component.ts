import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from 'src/app/tasks/task.service';
import { AccountService } from 'src/app/users/account.service';
import { CookieService } from 'ngx-cookie-service';
import { Task } from 'src/app/shared/model/task';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getUsername, getUserId, getName, getPicture } from 'src/app/users/state/user.reducer';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  accountSubscription;
  userIdSubscription;
  usernameSubscription;
  nameSubscription;
  noFriends = false;
  feedTasks: Task[] = [];
  personalTasks: Task[] = [];
  showComment = false;
  mappingSubscription;
  friendFeed = true;
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
                let feedSubscription = this.taskService.getFeedTasks(friendIds).subscribe(
                  (val) => {
                    feedSubscription.unsubscribe();
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
                          this.friendIdMap[account.id] = {
                            'creatorName': account.firstName + ' ' + account.lastName,
                            'creatorUsername': account.username,
                            'creatorPicture': account.picture
                          };
                        });
                        tasks.forEach(task => {
                          task['creatorName'] = this.friendIdMap[task.creatorId].creatorName;
                          task['creatorUsername'] = this.friendIdMap[task.creatorId].creatorUsername;
                          task['creatorPicture'] = this.friendIdMap[task.creatorId].creatorPicture;
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
          let personalSub = this.taskService.getFeedTasks([userId]).subscribe(
            (val) => {
              personalSub.unsubscribe();
              this.usernameSubscription = this.store.select(getUsername).subscribe(
                (username) => {
                  this.nameSubscription = this.store.select(getName).subscribe(
                    (name) => {
                      val.forEach(task => {
                        task['creatorName'] = name;
                        task['creatorUsername'] = username;
                        task['creatorPicture'] = this.store.select(getPicture);
                      })
                      this.personalTasks = val.sort(
                        (a,b) => {
                          let a_date = new Date(a.dateCompleted.seconds * 1000);
                          let b_date = new Date(b.dateCompleted.seconds * 1000);
                          return b_date.valueOf() - a_date.valueOf();
                        }
                      );
                    }
                  )
                }
              )
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
    if (this.mappingSubscription) {
      this.mappingSubscription.unsubscribe();
    }
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    if (this.nameSubscription) {
      this.nameSubscription.unsubscribe()
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
