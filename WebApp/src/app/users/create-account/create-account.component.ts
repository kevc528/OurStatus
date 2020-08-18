import { Component, OnInit } from '@angular/core';
import { Account } from '../../shared/model/account';
import { AccountService } from '../account.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  newAccount : Account = {
    firstName: null,
    lastName: null,
    email: null,
    username: null,
    password: null,
    groupIds: [],
    id: null,
    picture: "profile-pics/default.jpg"
  }

  confirmPassword: string = null;

  error: boolean = false;
  errorMessage: string;

  constructor(private accountService: AccountService, private router: Router, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Create account');
  }

  onSubmit(form: NgForm): void {
    let error = this.error;
    var router = this.router;
    if (form.valid) {
      if (this.newAccount.password == this.confirmPassword) {
        let subscription = this.accountService.getAccount(this.newAccount.username).subscribe(
          (res) => {
            if (res.length == 0) {
              subscription.unsubscribe();
              let emailSubscription = this.accountService.getAccountByEmail(this.newAccount.email).subscribe(
                (res) => {
                  emailSubscription.unsubscribe();
                  if (res.length == 0) {
                    this.accountService.createAccount(this.newAccount)
                      .then(function(ref) {
                        error = false;
                        router.navigate(['/login']);
                      }, function() {
                        this.error = true;
                        this.errorMessage = "Account couldn't be created, try again later";
                      });
                  } else {
                    this.error = true;
                    this.newAccount.email = '';
                    this.errorMessage = "Email already exists";
                  }
                }
              )           
            } else {
              subscription.unsubscribe();
              this.error = true;
              this.newAccount.username = '';
              this.errorMessage = 'Username already exists';
            } 
          }
        )
      } else {
        this.error = true;
        this.errorMessage = "Passwords don't match";
        this.newAccount.password = '';
        this.confirmPassword = '';
      }
    } else {
      this.error = true;
      this.errorMessage = "Please fix above errors";
    }
  }

}
