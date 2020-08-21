import { Component, OnInit, OnDestroy } from '@angular/core';
import { State, getUserId } from 'src/app/users/state/user.reducer';
import { Store } from '@ngrx/store';
import { AccountService } from 'src/app/users/account.service';
import { Friendship } from 'src/app/shared/model/friendship';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit, OnDestroy {

  requests: Friendship[];
  userIdSub: Subscription;
  userId: string;
  requestSubscription: Subscription;
  noRequests: boolean = false;

  constructor(private store: Store<State>, private accountService: AccountService) { }

  ngOnInit(): void {
    this.userIdSub = this.store.select(getUserId).subscribe(
      (val) => {
        if (val != null) {
          this.userId = val;
          this.requestSubscription = this.accountService.getFriendRequests(this.userId).subscribe(
            (val) => {
              if (val.length == 0) {
                this.noRequests = true;
                this.requests = val;
              } else {
                this.noRequests = false;
                this.requests = val;
              }
            }
          )
        }
      }
    )
  }

  ngOnDestroy(): void {
    if (this.userIdSub) {
      this.userIdSub.unsubscribe();
    }
    if (this.requestSubscription) {
      this.requestSubscription.unsubscribe();
    }
  }
}
