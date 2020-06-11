import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // accounts: any[];
  username: string = '';
  password: string = '';
  success: boolean = true;
  errorMessage: string;

  constructor(private accountService: AccountService) { 
  }

  ngOnInit(): void {
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
  onLogin(): void {
    let subscription = this.accountService.getAccount(this.username).subscribe(
      (res) => {
        if (res.length >= 1) {
          let account = res[0];
          if (account.password == this.password) {
            subscription.unsubscribe();
            window.location.href = 'http://www.youtube.com/watch?v=dQw4w9WgXcQ';
          } else {
            this.success = false;
            this.errorMessage = "Password doesn't match username";
            this.clearFields();
            subscription.unsubscribe();
          }
        } else {
          this.success = false;
          this.errorMessage = 'No username found!';
          this.clearFields();
          subscription.unsubscribe();
        }
      }
    );
  }
}
