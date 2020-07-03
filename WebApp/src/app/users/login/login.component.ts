import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgForm, NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  loginError: boolean = false;
  errorMessage: string = '';
  submitUsernameError: boolean = false;
  submitPasswordError: boolean = false;

  constructor(private accountService: AccountService, private titleService: Title) { 
  }

  ngOnInit(): void {
    this.titleService.setTitle('Login');
    // CODE TO DISPLAY ALL ACCOUNTS
    // this.accountService.getAllAccounts().subscribe(
    //   res => (this.accounts = res)
    // );

    // CODE TO UPDATE ACCOUNT
    // let subscription = this.accountService.findAccountKey('kevinc528').subscribe(
    //   (res) => {
    //     if (res.length >= 1) {
    //       subscription.unsubscribe();
    //       let accountKey = res[0].payload.doc.id;
    //       this.accountService.updateAccount(accountKey, { password: 'Password1!' })
    //         .then(function() {
    //           console.log('SUCCESS');
    //         }, function() {
    //           console.log('ERROR');
    //         })
    //     } else {
    //       subscription.unsubscribe();
    //       console.log('NO ACCOUNT');
    //     }
    //   }
    // )

    //CODE TO DELETE ACCOUNT
    // let subscription = this.accountService.findAccountKey('test').subscribe(
    //   (res) => {
    //     if (res.length >= 1) {
    //       subscription.unsubscribe();
    //       let accountKey = res[0].payload.doc.id;
    //       this.accountService.deleteAccount(accountKey)
    //         .then(function() {
    //           console.log('SUCCESS');
    //         }, function() {
    //           console.log('ERROR');
    //         })
    //     } else {
    //       subscription.unsubscribe();
    //       console.log('NO ACCOUNT');
    //     }
    //   }
    // )
  }

  clearFields(): void {
    this.username = '';
    this.password = '';
  }

  // think about passing user keys through the url
  // onLogin(): void {
  //   let subscription = this.accountService.getAccount(this.username).subscribe(
  //     (res) => {
  //       if (res.length >= 1) {
  //         let account = res[0];
  //         if (account.password == this.password) {
  //           subscription.unsubscribe();
  //           window.location.href = 'http://www.youtube.com/watch?v=dQw4w9WgXcQ';
  //         } else {
  //           this.success = false;
  //           this.errorMessage = "Password doesn't match username";
  //           this.clearFields();
  //           subscription.unsubscribe();
  //         }
  //       } else {
  //         this.success = false;
  //         this.errorMessage = 'No username found!';
  //         this.clearFields();
  //         subscription.unsubscribe();
  //       }
  //     }
  //   );
  // }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      let subscription = this.accountService.getAccount(this.username).subscribe(
      (res) => {
        if (res.length >= 1) {
          let account = res[0];
          if (account.password == this.password) {
            subscription.unsubscribe();
            window.location.href = 'http://www.youtube.com/watch?v=dQw4w9WgXcQ';
          } else {
            this.loginError = true;
            this.errorMessage = "Password doesn't match username";
            this.clearFields();
            subscription.unsubscribe();
            }
        } else {
          this.loginError = true;
          this.errorMessage = 'No username found!';
          this.clearFields();
          subscription.unsubscribe();
        }
        this.submitUsernameError = false;
        this.submitPasswordError = false;
      }
    );
    } else {
      this.loginError = true;
      if (this.username === '') {
        this.submitUsernameError = true;
      }
      if (this.password === '') {
        this.submitPasswordError = true;
      }
      this.errorMessage = "Please fix the above errors";
    }
  }
}
