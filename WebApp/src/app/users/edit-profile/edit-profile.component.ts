import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../account.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  username;
  userId;
  picture;
  file;
  @Input() picPath;

  constructor(public activeModal: NgbActiveModal, public cookieService: CookieService, private accountService: AccountService,
    private storage: AngularFireStorage) { }

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
          }
        );
      }
    )
  }

}
