import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../account.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Store } from '@ngrx/store';
import { State, getUserId, getUsername, getPicture } from '../state/user.reducer';
import { Subscription } from 'rxjs';
import * as UserActions from '../state/user.actions';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  username;
  originalUsername;
  userId;
  usernameSub: Subscription;
  userIdSub: Subscription;
  picture;
  file;
  @Input() picPath;

  constructor(public activeModal: NgbActiveModal, private accountService: AccountService,
    private storage: AngularFireStorage, private store: Store<State>) { }

  ngOnInit(): void {
    this.usernameSub = this.store.select(getUsername).subscribe(
      (val) => {
        this.originalUsername = val;
        if (this.username == null) {
          this.username = val;
        }
      }
    );
    this.userIdSub = this.store.select(getUserId).subscribe(
      (val) => {
        this.userId = val;
      }
    )
  }

  ngOnDestroy(): void {
    this.userIdSub.unsubscribe();
    this.usernameSub.unsubscribe();
  }

  onSubmitEdits() {
    if (this.username != this.originalUsername) {
      this.accountService.updateAccount(
        this.userId,
        {
          username: this.username
        }
      ).then(
        val => {
          this.store.dispatch(UserActions.changeUsername({ username: this.username }))
        }
      );
    }
    if (this.picture) {
      this.uploadPicture();
    }
    this.activeModal.close();
  }

  onPicChange(event) {
    this.file = event.target.files[0];
  }

  uploadPicture() {
    let midPath = this.userId + Date.now();
    let filePath;
    if (this.file.type.split('/')[1] == 'png') {
      filePath = 'profile-pics/' + midPath + '.png';
    } 
    if (this.file.type.split('/')[1] == 'jpeg') {
      filePath = 'profile-pics/' + midPath + '.jpg';
    }
    this.storage.upload(filePath, this.file).then(
      (val) => {
        this.accountService.updateAccount(this.userId, {'picture' : filePath}).then(
          (val) => {
            this.picture = '';
            this.file = null;
            if (this.picPath != 'profile-pics/default.jpg') {
              this.storage.ref(this.picPath).delete();
            }
            let sub = this.accountService.getPicDownload(filePath).subscribe(
              val => {
                sub.unsubscribe();
                this.store.dispatch(UserActions.changePicture({ picture: val }));
              }
            )
          }
        );
      }
    )
  }

}
