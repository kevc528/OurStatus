import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from 'src/app/tasks/task.service';
import { AccountService } from 'src/app/users/account.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  username;
  accountSubscription;
  feedSubscription;
  noFriends = false;
  feedTasks = [];
  showComment = false;
  commentTaskId = '';

  constructor(private taskService: TaskService, private accountService: AccountService, 
    private cookieService: CookieService) { 
    }

  ngOnInit(): void {
    this.username = this.cookieService.get('user');
    this.accountSubscription = this.accountService.getAccount(this.username).subscribe(
      (res) => {
        if (res.length > 0) {
          let account = res[0];
          if (account.friends.length > 0) {
            this.feedSubscription = this.taskService.getFeedTasks(account.friends).subscribe(
              (val) => {
                this.feedTasks = val.sort(
                  (a,b) => {
                    let a_date = new Date(a.dateCompleted.seconds * 1000);
                    let b_date = new Date(b.dateCompleted.seconds * 1000);
                    return b_date.valueOf() - a_date.valueOf();
                  }
                );
              }
            );
          } else {
            this.noFriends = true;
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
    this.feedSubscription.unsubscribe();
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
