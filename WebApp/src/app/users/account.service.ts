import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Account } from '../shared/model/account';
import { AngularFireModule } from '@angular/fire';
import * as firebase from "firebase/app";
import "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private firestore: AngularFirestore) { 
    if (!firebase.apps.length){
      var firebaseConfig = {
        apiKey: "AIzaSyB-CuxGBSwGbgsM88C97F4pU7jLSMBVavw",
        authDomain: "ourstatus-71678.firebaseapp.com",
        databaseURL: "https://ourstatus-71678.firebaseio.com",
        projectId: "ourstatus-71678",
        storageBucket: "ourstatus-71678.appspot.com",
        messagingSenderId: "158499871442",
        appId: "1:158499871442:web:9e3bdd6ade46d8fd792b0b",
        measurementId: "G-RJ70VQGR3C"
      };
      firebase.initializeApp(firebaseConfig);
    }
  }

  createAccount(account: Account): Promise<any> {
    let password = account["password"];
    delete account["password"];
    return this.firestore.collection('users').add(account)
      .then((value) => {
        firebase.auth().createUserWithEmailAndPassword(account.email, password).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
        })});
  }

  // returns observable for the entire account list
  getAllAccounts() : Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }

  // returns an account observable filtered by username
  getAccount(username: string) : Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('username', '==', username)).valueChanges();
  }

  getAccountByEmail(email: string) : Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('email', '==', email)).valueChanges();
  }

  findAccountKey(username: string) : Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('username', '==', username)).snapshotChanges()
  }

  // finds account doc from username and updates the account w/ new data
  // updateAccount(username: string, newData) {
  //   var success: boolean;
  //   var accountId: string;
  //   var promise: Promise<void>;
  //   let subscription = this.firestore.collection('users', ref => ref.where('username', '==', username))
  //     .snapshotChanges()
  //     .subscribe(
  //       (res) => {
  //         if (res.length >= 1) {
  //           subscription.unsubscribe();
  //           // accountId is the key for the key value in the db for a specific account
  //           accountId = res[0].payload.doc.id;
  //           success = true;
  //           let accountDoc = this.firestore.collection('users').doc(accountId);
  //           promise = accountDoc.update(newData);
  //         } else {
  //           subscription.unsubscribe();
  //           success = false;
  //         }
  //         // return {'success': success, 'promise': promise};
  //       }
  //     );

  updateAccount(accountKey: string, newData): Promise<void> {
    let accountDoc = this.firestore.collection('users').doc(accountKey);
    return accountDoc.update(newData);
  }

  // deleteAccount(username: string) {
  //   var success: boolean;
  //   var accountId: string;
  //   var promise: Promise<void>;
  //   let subscription = this.firestore.collection('users', ref => ref.where('username', '==', username))
  //     .snapshotChanges()
  //     .subscribe(
  //       (res) => {
  //         if (res.length >= 1) {
  //           subscription.unsubscribe();
  //           // accountId is the key for the key value in the db for a specific account
  //           accountId = res[0].payload.doc.id;
  //           success = true;
  //           let accountDoc = this.firestore.collection('users').doc(accountId);
  //           promise = accountDoc.delete();
  //         } else {
  //           subscription.unsubscribe();
  //           success = false;
  //         }
  //         // return {'success': success, 'promise': promise};
  //       }
  //     );
    // setTimeout(() => {
    //   subscription.unsubscribe();
    //   return {'success': success, 'promise': promise};
    // }, 30000);
  //   return {'success': success, 'promise': promise};
  // }

  deleteAccount(accountKey: string): Promise<void> {
    let accountDoc = this.firestore.collection('users').doc(accountKey);
    return accountDoc.delete();
  }

}
