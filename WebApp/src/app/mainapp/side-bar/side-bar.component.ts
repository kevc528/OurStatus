import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/users/account.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnDestroy {

  username: string;
  account;
  userId;
  accountSubscription;
  profilePic;

  constructor(private cookieService: CookieService, private router: Router, private accountService: AccountService) { 
  }

  ngOnInit(): void {
    this.username = this.cookieService.get('user');
    this.userId = this.cookieService.get('id');
    this.accountSubscription = this.accountService.getAccountFromId(this.userId).subscribe(
      (val) => {
        this.account = val;
        this.profilePic = this.accountService.getPicDownload(this.account.picture);
        this.username = this.account.username;
        console.log(this.username);
      }
    )
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  onLogOut(): void {
    this.cookieService.deleteAll('/');
    this.router.navigate(['/login']);
  }

}
