import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/users/account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileComponent } from 'src/app/users/edit-profile/edit-profile.component';
import { Store } from '@ngrx/store';
import { State, getUserId } from 'src/app/users/state/user.reducer';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  username: string;
  account;
  accountSubscription;
  profilePic;
  userIdSub;
  userId;
  picPath;
  name;

  constructor(private cookieService: CookieService, private accountService: AccountService,
    private modalService: NgbModal, private store: Store<State>) { }

  ngOnInit(): void {
    this.userIdSub = this.store.select(getUserId).subscribe(
      val => {
        this.userId = val;
        if (this.userId != null) {
          this.accountSubscription = this.accountService.getAccountFromId(this.userId).subscribe(
            (val) => {
              this.account = val;
              this.picPath = this.account.picture;
              this.profilePic = this.accountService.getPicDownload(this.account.picture);
              this.username = this.account.username;
              this.name = this.account.firstName + ' ' + this.account.lastName;
            }
          )
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) { 
      this.accountSubscription.unsubscribe();
    }
    this.userIdSub.unsubscribe();
  }

  openEditModal() {
    const modalRef = this.modalService.open(EditProfileComponent, { size: 'lg'});
    modalRef.componentInstance.name = 'Edit Profile';
    modalRef.componentInstance.picPath = this.picPath;
  }

}
