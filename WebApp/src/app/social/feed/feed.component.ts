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
                this.feedTasks = val;
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

}
