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
    let account = {
      username: "test",
      task_ids: [],
      password: "Password1!",
      firstName: "TestFirst",
      lastName: "TestLast",
      email: "test@gmail.com",
    } as Account;
    this.accountService.createAccount(account);
  }

}
