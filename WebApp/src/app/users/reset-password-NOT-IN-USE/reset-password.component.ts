import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  username: string;
  password: string;
  pin: string;
  passwordConfirm: string;
  errorMessage: string;
  error: boolean = false;

  constructor(private accountService: AccountService) { 
    this.username = (new URLSearchParams(window.location.search)).get('user');
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    if (form.valid) {
      if (this.password == this.passwordConfirm) {
        let subscription = this.accountService.getAccount(this.username).subscribe(
          (res) => {
            if (res.length >= 1) {
              let account = res[0];
              let resetPin = account.passwordResetKey;
              if (this.pin == resetPin) {
                
              } else {
                
              }
            } else {
              this.error = true;
              this.errorMessage = "No such username";
            }
          }
        )
      } else {
        this.error = true;
        this.errorMessage = "Passwords don't match";
        this.password = "";
        this.passwordConfirm = "";
      }
    } else {
      this.error = true;
      this.errorMessage = "Please fix above errors";
    }
  }

}
