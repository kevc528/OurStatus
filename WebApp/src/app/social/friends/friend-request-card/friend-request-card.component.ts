import { Component, OnInit, Input } from '@angular/core';
import { Friendship } from 'src/app/shared/model/friendship';
import { AccountService } from 'src/app/users/account.service';
import { Account } from 'src/app/shared/model/account';

@Component({
  selector: 'app-friend-request-card',
  templateUrl: './friend-request-card.component.html',
  styleUrls: ['./friend-request-card.component.css']
})
export class FriendRequestCardComponent implements OnInit {

  @Input() friendship: Friendship;
  @Input() userId: string;
  otherUserId: string;
  otherAccount: Account;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    if (this.friendship.firstId == this.userId) {
      this.otherUserId = this.friendship.secondId;
    } else {
      this.otherUserId = this.friendship.firstId;
    }
    let accountSub = this.accountService.getAccountFromId(this.otherUserId).subscribe(
      (val) => {
        accountSub.unsubscribe();
        this.otherAccount = val;
      }
    )
  }

  confirmRequest(): void {
    this.accountService.confirmFriendRequest(this.friendship.id);
  }

  denyRequest(): void {
    this.accountService.removeFriendship(this.friendship.id);
  }

}
