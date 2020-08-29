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
            this.cookieService.deleteAll('/');
            this.store.dispatch(UserActions.logoutUser());
            this.router.navigateByUrl('/login');
          } else {
            let sub = this.accountService.getUserIdFromCookie(cookie).subscribe(
              val => {
                sub.unsubscribe();
                if (!val) {
                  this.cookieService.deleteAll('/');
                  this.store.dispatch(UserActions.logoutUser());
                  this.router.navigateByUrl('/login');
                  this.accountService.deleteCookie(cookie);
                } else {
                  let id = val.userId;
                  let expiration = new Date(val.expiration.seconds * 1000);
                  if (expiration < new Date()) {
                    this.cookieService.deleteAll('/');
                    this.store.dispatch(UserActions.logoutUser());
                    this.router.navigateByUrl('/login');
                    this.accountService.deleteCookie(cookie);
                  } else {
                    let userSub = this.accountService.getAccountFromId(id).subscribe(
                      (account) => {
                        userSub.unsubscribe();
                        let user: UserState = {
                          username: account.username,
                          userId: account.id,
                          picture: null,
                          firstName: account.firstName,
                          lastName: account.lastName
                        }
                        this.store.dispatch(UserActions.signIn({user}));
                        let pic = this.accountService.getPicDownload(account.picture).subscribe(
                          (val) => {
                            pic.unsubscribe();
                            this.store.dispatch(UserActions.changePicture({picture: val}));
                          }
                        );
                      }
                    )
                  }
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
    this.accountService.deleteCookie(this.cookieService.get('sessionId'));
    this.cookieService.deleteAll('/');
    this.store.dispatch(UserActions.logoutUser());
    this.router.navigateByUrl('/login');
  }

}
