import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Account } from '../shared/model/account';
import { AngularFireModule } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private firestore: AngularFirestore) { 
  }

  createAccount(account: Account): void {
    this.firestore.collection('users').add(account);
  }

  // returns observable for the entire account list
  getAllAccounts() : Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }

  // returns an account observable filtered by username
  getAccount(username: string) : Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('username', '==', username)).valueChanges();
  }

  // finds account doc from username and updates the account w/ new data
  updateAccount(username: string, newData) {
    var success: boolean;
    var accountId: string;
    var promise: Promise<void>;
    let subscription = this.firestore.collection('users', ref => ref.where('username', '==', username))
      .snapshotChanges()
      .subscribe(
        (res) => {
          if (res.length >= 1) {
            subscription.unsubscribe();
            // accountId is the key for the key value in the db for a specific account
            accountId = res[0].payload.doc.id;
            success = true;
            let accountDoc = this.firestore.collection('users').doc(accountId);
            promise = accountDoc.update(newData);
          } else {
            subscription.unsubscribe();
            success = false;
          }
          // return {'success': success, 'promise': promise};
        }
      );
    // setTimeout(() => {
    //   subscription.unsubscribe();
    //   return {'success': success, 'promise': promise};
    // }, 30000);
    return {'success': success, 'promise': promise};
  }

  deleteAccount(username: string) {
    var success: boolean;
    var accountId: string;
    var promise: Promise<void>;
    let subscription = this.firestore.collection('users', ref => ref.where('username', '==', username))
      .snapshotChanges()
      .subscribe(
        (res) => {
          if (res.length >= 1) {
            subscription.unsubscribe();
            // accountId is the key for the key value in the db for a specific account
            accountId = res[0].payload.doc.id;
            success = true;
            let accountDoc = this.firestore.collection('users').doc(accountId);
            promise = accountDoc.delete();
          } else {
            subscription.unsubscribe();
            success = false;
          }
          // return {'success': success, 'promise': promise};
        }
      );
    // setTimeout(() => {
    //   subscription.unsubscribe();
    //   return {'success': success, 'promise': promise};
    // }, 30000);
    return {'success': success, 'promise': promise};
  }

}
