import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/users/account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileComponent } from 'src/app/users/edit-profile/edit-profile.component';

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
  userId;
  picPath;

  constructor(private cookieService: CookieService, private accountService: AccountService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userId = this.cookieService.get('id');
    this.accountSubscription = this.accountService.getAccountFromId(this.userId).subscribe(
      (val) => {
        this.account = val;
        this.picPath = this.account.picture;
        this.profilePic = this.accountService.getPicDownload(this.account.picture);
        this.username = this.account.username;
        console.log(this.username);
      }
    )
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  openEditModal() {
    const modalRef = this.modalService.open(EditProfileComponent, { size: 'lg'});
    modalRef.componentInstance.name = 'Edit Profile';
    modalRef.componentInstance.picPath = this.picPath;
  }

}
