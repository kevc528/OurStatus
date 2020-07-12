import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as nodemailer from 'nodemailer';
import { AccountService } from '../account.service';
import { Title } from '@angular/platform-browser';

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

  constructor(private router: Router, private accountService: AccountService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Forgot your Password');
  }

  clearFields(): void {
    this.username = '';
    this.email = '';
  }

  sendEmail(): void {
    // let transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'OurStatusApp@gmail.com',
    //     pass: 'gimmethemtoez'
    //   }
    // });
    
    // let mailOptions = {
    //   from: 'OurStatusApp@gmail.com',
    //   to: this.email,
    //   subject: 'Reset your OurStatus Password',
    //   text: 'Ooga booga booga'
    // };
    
    // transporter.sendMail(mailOptions, function(error, info){
    //   if (error) {
    //     alert(error);
    //   } else {
    //     // 
    //   }
    // });
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
              this.errorMessage = "Username doesn't exist";
              this.clearFields()
              subscription.unsubscribe();            
            }
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
