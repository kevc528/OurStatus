import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  username;
  userId;

  constructor(public activeModal: NgbActiveModal, public cookieService: CookieService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.username = this.cookieService.get('user');
    this.userId = this.cookieService.get('id');
  }

  // will use NgRX/redux later to make sure the state for the user is correctly changed
  onSubmitEdits() {
    if (this.username != this.cookieService.get('user')) {
      this.accountService.updateAccount(
        this.userId,
        {
          username: this.username
        }
      ).then(
        val => {
          this.cookieService.delete('user');
          this.cookieService.set('user', this.username);
          // location.reload();
        }
      );
    }
  }

}
