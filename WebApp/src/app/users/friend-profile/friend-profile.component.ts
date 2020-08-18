import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../account.service';
import { Subscription, Observable } from 'rxjs';
import { Friendship } from 'src/app/shared/model/friendship';
import { Store } from '@ngrx/store';
import { State, getUserId } from '../state/user.reducer';
import { Account } from 'src/app/shared/model/account';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent implements OnInit {

  @Input() friendAccount: Account;
  pic: Observable<any>;
  userId: string;
  userIdSubscription: Subscription;
  friendship: Friendship;
  friendshipSubscription: Subscription;

  constructor(private accountService: AccountService, private store: Store<State>) { }

  ngOnInit(): void {
    this.friendAccount = {
      id: 'OCLRcF5zwG2isGz7fhvw',
      username: 'blah',
      firstName: '',
      lastName: '',
      email: '',
      groupIds: [],
      picture: '',
    };
    this.pic = this.accountService.getPicDownload(this.friendAccount.picture);
    this.store.select(getUserId).subscribe(
      (val) => {
        this.userId = val;
        this.friendshipSubscription = this.accountService.findFriendship(this.userId, this.friendAccount.id).subscribe(
          (res) => {
            if (res.length > 0)
              this.friendship = res[0];
          }
        )
      }
    )
  }
}
