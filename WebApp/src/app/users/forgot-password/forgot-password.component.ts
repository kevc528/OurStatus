import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as nodemailer from 'nodemailer';
import { AccountService } from '../account.service';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { session } from '../../session';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  username: string = '';
  email: string = '';
  submitError: boolean = false;
  errorMessage: string = '';
  submitUsernameError: boolean = false;
  submitEmailError: boolean = false;

  constructor(private router: Router, private accountService: AccountService, private titleService: Title
    , private http: HttpClient ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Forgot your Password');
  }

  clearFields(): void {
    this.username = '';
    this.email = '';
  }

  sendEmail(): void {
    let sendRoute = session.emailService + '/send-email';
    let body = {
      "recipient": this.email,
      "subject": "Resetting your OurStatus Password",
      "Text": "Ooga booga"
    }
    let subscription = this.http.post(sendRoute, body, {responseType: 'text'}).subscribe(
      (res) => {
        if (res == 'success') {
          subscription.unsubscribe();
          this.router.navigate(['/login']);
        } else {
          subscription.unsubscribe();
          alert('Error occured, please try again later');
        }
      }
    );
  }

  onSubmit(form): void {
    if (form.valid) {
      let subscription = this.accountService.getAccount(this.username).subscribe(
        (res) => {
          if (res.length >= 1) {
            let account = res[0];
            if (account.email == this.email) {
              subscription.unsubscribe();
              let emailSubscription = this.accountService.getAccountByEmail(this.email).subscribe(
                (res) => {
                  if (res.length >= 1) {
                    emailSubscription.unsubscribe()
                    this.sendEmail();
                  } else {
                    this.submitError = true;
                    this.errorMessage = "Email isn't linked with an account";
                    this.clearFields();
                    emailSubscription.unsubscribe();    
                  }
                }
              )
            } else {
              this.submitError = true;
              this.errorMessage = "Email isn't linked with an account";
              this.clearFields()
              subscription.unsubscribe();            
            }
          } else {
            this.submitError = true;
            this.errorMessage = "Username doesn't exist";
            this.clearFields()
            subscription.unsubscribe();  
          }
        }
      )
    } else {
      this.submitError = true;
      if (this.username === '') {
        this.submitUsernameError = true;
      }
      if (this.email === '') {
        this.submitEmailError = true;
      }
      this.errorMessage = "Please fix the above errors";
    }
  }

}
