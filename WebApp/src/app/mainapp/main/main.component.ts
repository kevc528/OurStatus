import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { AccountService } from 'src/app/users/account.service';
import { UserState, State, getUserId } from 'src/app/users/state/user.reducer';
import { Store } from '@ngrx/store';
import * as UserActions from '../../users/state/user.actions'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  storageCheck;

  constructor(private router: Router, private cookieService: CookieService, private titleService: Title,
    private accountService: AccountService, private store: Store<State>) { 
    }

  ngOnInit(): void {
    this.titleService.setTitle('OurStatus');
  }

}
