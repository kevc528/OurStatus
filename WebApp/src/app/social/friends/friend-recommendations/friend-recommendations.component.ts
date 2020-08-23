import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/users/account.service';
import { Store } from '@ngrx/store';
import { State, getUserId } from 'src/app/users/state/user.reducer';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from 'src/app/shared/model/account';

@Component({
  selector: 'app-friend-recommendations',
  templateUrl: './friend-recommendations.component.html',
  styleUrls: ['./friend-recommendations.component.css']
})
export class FriendRecommendationsComponent implements OnInit, OnDestroy {

  userIdSub: Subscription;
  userId: string;
  myFriends: string[];
  friendActivity: string[];
  noFriends: boolean = false;
  friendRecommendations: string[] = [];
  numberOfRecs = 10;
  noRecs: boolean;
  recommendationAccounts: Account[];

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
    let myFriendSub = this.accountService.findFriendActivity(this.userId).subscribe(
      (val) => {
        myFriendSub.unsubscribe();
        this.friendActivity = val.map(relationship => {
          if (relationship.firstId == this.userId) {
            return relationship.secondId;
          } else {
            return relationship.firstId;
          }
        });
        this.myFriends = val.filter(x => x.request == false).map(relationship => {
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
          let neighborSub = this.getSecondFriendObs(myRandomFriends).subscribe(
            val => {
              neighborSub.unsubscribe();
              let myFriendActivitySet = new Set(this.friendActivity);
              let myFriendSet = new Set(this.myFriends);
              let weights = this.getWeights(myFriendSet, myRandomFriends, val);
              this.friendRecommendations = this.getRecommended(weights, myRandomFriends, myFriendActivitySet, val);
              if (this.friendRecommendations.length == 0) {
                this.noRecs = false;
              } else {
                let accountsSub = this.accountService.getAccountsByIds(this.friendRecommendations).subscribe(
                  (val) => {
                    accountsSub.unsubscribe();
                    this.recommendationAccounts = val;
                  }
                )
              }
            }
          )
        }
      }
    )
  }

  getWeights(friendSet: Set<string>, randomFriends: string[], secondaryFriends) {
    let mutualNums = secondaryFriends.map((x, i) => [randomFriends[i], x.filter(n => 
      friendSet.has(n.firstId==randomFriends[i]?n.secondId: n.firstId)).length]);
    let bestMutuals = mutualNums.sort((a,b) => {
      return b[1] - a[1];
    }).slice(0,5);
    let sum = bestMutuals.reduce((acc, curr) => acc + curr[1], 0);
    let weights = bestMutuals.map(x => [x[0], sum==0?Math.round(1 / bestMutuals.length * this.numberOfRecs):Math.round(x[1] / sum * this.numberOfRecs)]);
    return weights
  }

  getRecommended(weights, myRandomFriends, myFriendActivitySet, secondaryFriends): string[] {
    let mutualFriendMap = {}
    let recommendations: string[] = [];
    secondaryFriends.map((x,i) => mutualFriendMap[myRandomFriends[i]] = x.map(n => n.firstId==myRandomFriends[i]?n.secondId: n.firstId));
    let backup: string[] = [];
    weights.forEach(
      (weight) => {
        let friendId = weight[0];
        let recNum = weight[1];
        if (recommendations.length < this.numberOfRecs && (recNum > 0 || backup.length < this.numberOfRecs)) {
          let filteredFriends = mutualFriendMap[friendId].filter(x => x != this.userId && !myFriendActivitySet.has(x));
          let randomized = this.getNRandomElements(filteredFriends, Math.min(filteredFriends.length, this.numberOfRecs))
          let added = 0;
          for (let i = 0; i < randomized.length; i++) {
            if (added < recNum) {
              if (!recommendations.includes(randomized[i])) {
                recommendations.push(randomized[i]);
                added++;
              }
            } else {
              if (backup.length < this.numberOfRecs && !backup.includes(randomized[i]) && !recommendations.includes(randomized[i])) {
                backup.push(randomized[i]);
              }
            }
          }
        }
      }
    )
    if (recommendations.length < this.numberOfRecs) {
      let toAdd = backup.splice(0, Math.min(backup.length, this.numberOfRecs - recommendations.length));
      toAdd.forEach(val => recommendations.push(val));
    }
    return recommendations;
  }

  getNRandomElements(list: string[], n: number): string[] {
    return list.sort(() => { return Math.round(Math.random()) - 0.5}).slice(0,n);
  }

  // getNonMutualFriends(friends: string)

  getSecondFriendObs(friends: string[]): Observable<any[]> {
    let obs: Observable<any>[] = [];
    friends.forEach((friend) => {
      obs.push(this.accountService.findFriends(friend));
    })
    let final = combineLatest(...obs);
    return final;
  }

  ngOnDestroy(): void {
    if (this.userIdSub) {
      this.userIdSub.unsubscribe();
    }
  }

}
