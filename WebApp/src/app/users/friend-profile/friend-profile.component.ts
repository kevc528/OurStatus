import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AccountService } from '../account.service';
import { Subscription, Observable } from 'rxjs';
import { Friendship } from 'src/app/shared/model/friendship';
import { Store } from '@ngrx/store';
import { State, getUserId, getUsername } from '../state/user.reducer';
import { Account } from 'src/app/shared/model/account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent implements OnInit, OnDestroy {

  friendAccount: Account;
  pic: Observable<any>;
  userId: string;
  accountUsername;
  userIdSubscription: Subscription;
  friendship: Friendship;
  friendshipSubscription: Subscription;
  buttonVisible;
  usernameSub: Subscription;

  constructor(private accountService: AccountService, private store: Store<State>, private router: Router) { }

  ngOnInit(): void {
    this.accountUsername = window.location.pathname.split("/").pop();
    this.usernameSub = this.store.select(getUsername).subscribe(
      (val) => {
        if (val != null) {
          if (val == this.accountUsername) {
            this.router.navigate(['/app/profile']);
          } else {
            let accountSub = this.accountService.getAccount(this.accountUsername).subscribe(
              (val) => {
                accountSub.unsubscribe();
                if (val.length > 0) {
                  this.friendAccount = val[0];
                  this.pic = this.accountService.getPicDownload(this.friendAccount.picture);
                  this.userIdSubscription = this.store.select(getUserId).subscribe(
                    (val) => {
                      this.userId = val;
                      this.friendshipSubscription = this.accountService.findFriendship(this.userId, this.friendAccount.id).subscribe(
                        (res) => {
                          this.buttonVisible = true;
                          if (res.length > 0)
                            this.friendship = res[0];
                          else 
                            this.friendship = null;
                        }
                      )
                    }
                  )
                }
              }
            )
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
    if (this.friendshipSubscription) {
      this.friendshipSubscription.unsubscribe();
    }
  }

  requestFriend(): void {
    this.accountService.requestFriend(this.userId, this.friendAccount.id);
  }

  confirmRequest(): void {
    this.accountService.confirmFriendRequest(this.friendship.id);
  }

  removeRequest(): void {
    this.accountService.removeFriendship(this.friendship.id);
  }
}
