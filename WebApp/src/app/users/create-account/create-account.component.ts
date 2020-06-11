import { Component, OnInit } from '@angular/core';
import { Account } from '../../shared/model/account';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {


  success: boolean = true;
  errorMessage: string;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.onCreateAccount();
  }

  onCreateAccount(): void {
    // in the actual create account page, the account vars will be bound to angular form
    let account = {
      username: "test",
      task_ids: [],
      password: "Password1!",
      firstName: "TestFirst",
      lastName: "TestLast",
      email: "test@gmail.com",
      friends: [],
      group_ids: []
    } as Account;
    // promise, then return to log in again
    this.accountService.createAccount(account)
      .then(function() {
        window.location.href = 'http://www.youtube.com/watch?v=dQw4w9WgXcQ';
      }, function() {
        this.success = false;
        this.errorMessage = "Account couldn't be created";
      });
  }

}
