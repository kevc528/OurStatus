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
    // code to display all accounts
    // this.accountService.getAllAccounts().subscribe(
    //   res => (this.accounts = res)
    // );
    // this.accountService.updateAccount('kevinc528', { password: 'Password3!' });
    // this.accountService.deleteAccount('test');
  }

  clearFields(): void {
    this.username = '';
    this.password = '';
  }

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
