import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/users/account.service';
import { Store } from '@ngrx/store';
import { State, getUserId } from 'src/app/users/state/user.reducer';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-friend-recommendations',
  templateUrl: './friend-recommendations.component.html',
  styleUrls: ['./friend-recommendations.component.css']
})
export class FriendRecommendationsComponent implements OnInit, OnDestroy {

  userIdSub: Subscription;
  userId: string;
  myFriends: string[];
  noFriends: boolean = false;
  friendRecommendations: Account[] = [];
  numberOfRecs = 10;

  constructor(private accountService: AccountService, private store: Store<State>) { }

  ngOnInit(): void {
    this.userIdSub = this.store.select(getUserId).subscribe(
      (val) => {
        if (val != null) {
          this.userId = val;
          this.getRecommendations();
        }
      }
    )
  }

  getRecommendations(): void {
    let myFriendSub = this.accountService.findFriends(this.userId).subscribe(
      (val) => {
        myFriendSub.unsubscribe();
        this.myFriends = val.map(relationship => {
          if (relationship.firstId == this.userId) {
            return relationship.secondId;
          } else {
            return relationship.firstId;
          }
        });
        if (this.myFriends.length == 0) {
          this.noFriends = true;
        } else {
          this.noFriends = false;
          let myRandomFriends = this.getNRandomElements(this.myFriends, Math.min(10, this.myFriends.length));
          let mutualSub = this.getMutualFriendObs(myRandomFriends).subscribe(
            val => {
              mutualSub.unsubscribe();
              let bestMutuals = val.sort((a,b) => {
                return b[1] - a[1];
              }).slice(0,5);
              let sum = bestMutuals.reduce((acc, curr) => acc + curr[1], 0);
              let weights = bestMutuals.map(x => [x[0], sum==0?Math.round(1 / bestMutuals.length * this.numberOfRecs):Math.round(x[1] / sum * this.numberOfRecs)]);
              console.log(weights);
            }
          )
        }
      }
    )
  }

  getNRandomElements(list: string[], n: number): string[] {
    return list.sort(() => { return Math.round(Math.random()) - 0.5}).slice(0,n);
  }

  // getNonMutualFriends(friends: string)

  getMutualFriendObs(friends: string[]): Observable<any[]> {
    let obs: Observable<any>[] = [];
    friends.forEach((friend) => {
      obs.push(this.accountService.findFriends(friend));
    })
    let final = combineLatest(...obs).pipe(map((x) => x.map((x, i) => [friends[i], x.filter(val => 
      friends.includes(val.firstId==friends[i]?val.secondId: val.firstId)).length])));
    return final;
  }

  ngOnDestroy(): void {
    if (this.userIdSub) {
      this.userIdSub.unsubscribe();
    }
  }

}
