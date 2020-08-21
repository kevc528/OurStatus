import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/users/account.service';
import { State, getUserId } from 'src/app/users/state/user.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/shared/model/account';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit, OnDestroy {

  friendList: Account[] = [];
  userIdSub: Subscription;
  userId: string;

  constructor(private accountService: AccountService, private store: Store<State>) { }

  ngOnInit(): void {
    this.userIdSub = this.store.select(getUserId).subscribe(
      val => {
        if (val != null) {
          this.userId = val;
          let friendSub = this.accountService.findFriends(val).subscribe(
            (friends) => {
              friendSub.unsubscribe()
              if (friends.length > 0) {
                let friendIds = [];
                friends.forEach((friendship) => {
                  if (friendship.firstId == this.userId) {
                    friendIds.push(friendship.secondId);
                  } else {
                    friendIds.push(friendship.firstId);
                  }
                });
                let friendAccountSub = this.accountService.getAccountsByIds(friendIds).subscribe(
                  (val) => {
                    friendAccountSub.unsubscribe();
                    this.friendList = val;
                  }
                )
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
  }

}
