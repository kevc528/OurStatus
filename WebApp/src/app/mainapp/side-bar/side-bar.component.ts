import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/users/account.service';
import { Store } from '@ngrx/store';
import { State, getUsername, getPicture, UserState } from 'src/app/users/state/user.reducer';
import * as UserActions from '../../users/state/user.actions'
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnDestroy {

  username: string;
  usernameSub: Subscription;
  profilePic;

  constructor(private store: Store<State>, private cookieService: CookieService, private router: Router, private accountService: AccountService) { 
  }

  ngOnInit(): void {
    this.usernameSub = this.store.select(getUsername).subscribe(
      (val) => {
        if (val == null) {
          let cookie = this.cookieService.get('sessionId');
          if (!cookie) {
            this.router.navigate(['/login']);
          } else {
            let sub = this.accountService.getAccountByCookie(cookie).subscribe(
              val => {
                sub.unsubscribe();
                if (val.length == 0) {
                  this.router.navigate(['/login']);
                } else {
                  let account = val[0];
                  let user: UserState = {
                    username: account.username,
                    userId: account.id,
                    picture: null
                  }
                  this.store.dispatch(UserActions.signIn({user}));
                  let pic = this.accountService.getPicDownload(account.picture).subscribe(
                    (val) => {
                      pic.unsubscribe();
                      this.store.dispatch(UserActions.changePicture({picture: val}));
                    }
                  );
                }
              }
            )
          }
        } else {
          this.username = val;
        }
      }
    );
    this.profilePic = this.store.select(getPicture);
  }

  ngOnDestroy(): void {
    this.usernameSub.unsubscribe();
  }

  onLogOut(): void {
    this.cookieService.deleteAll('/');
    this.store.dispatch(UserActions.logoutUser());
    this.router.navigate(['/login']);
  }

}
