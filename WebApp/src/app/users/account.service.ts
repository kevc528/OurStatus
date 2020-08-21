import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable, merge, zip, concat, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from '../shared/model/account';
import { AngularFireModule } from '@angular/fire';
import * as firebase from "firebase/app";
import "firebase/auth";
import { AngularFireStorage } from '@angular/fire/storage';
import { Friendship } from '../shared/model/friendship';
import { MinLengthValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { 
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
    var firestore = this.firestore
    return this.firestore.collection('users').add(account)
      .then((doc) => {
        firestore.collection('users').doc(doc.id).update({'id': doc.id});
        firebase.auth().createUserWithEmailAndPassword(account.email, password).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
        })});
  }

  // returns observable for the entire account list
  getAllAccounts() : Observable<Account[]> {
    return this.firestore.collection<Account>('users').valueChanges();
  }

  // returns an account observable filtered by username
  getAccount(username: string) : Observable<Account[]> {
    return this.firestore.collection<Account>('users', ref => ref.where('username', '==', username)).valueChanges();
  }

  getAccountByEmail(email: string) : Observable<Account[]> {
    return this.firestore.collection<Account>('users', ref => ref.where('email', '==', email)).valueChanges();
  }

  getUserIdFromCookie(cookie: string): Observable<any> {
    return this.firestore.collection('cookie').doc(cookie).valueChanges();
  }

  findAccountKey(username: string) : Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('username', '==', username)).snapshotChanges()
  }

  findFriends(userId: string): Observable<Friendship[]> {
    let resultA = this.firestore.collection<Friendship>('friendship', ref => ref.where('firstId', '==', userId)
      .where('request', '==', false)).valueChanges();
    let resultB = this.firestore.collection<Friendship>('friendship', ref => ref.where('secondId', '==', userId)
      .where('request', '==', false)).valueChanges();
    let final = combineLatest(resultA, resultB).pipe(map(([s1, s2]) => [...s1, ...s2]));
    return final;
  }

  findFriendship(firstId: string, secondId: string): Observable<Friendship[]> {
    let resultA = this.firestore.collection<Friendship>('friendship', ref => ref.where('firstId', '==', firstId)
      .where('secondId', '==', secondId)).valueChanges();
    let resultB = this.firestore.collection<Friendship>('friendship', ref => ref.where('secondId', '==', firstId)
      .where('firstId', '==', secondId)).valueChanges();
    let final = combineLatest(resultA, resultB).pipe(map(([s1, s2]) => [...s1, ...s2]));
    return final;
  }

  updateAccount(accountKey: string, newData): Promise<void> {
    let accountDoc = this.firestore.collection('users').doc(accountKey);
    return accountDoc.update(newData);
  }

  getAccountsByIds(userIds: string[]): Observable<Account[]> {
    let obsList: Observable<Account[]>[] = [];
    for (let i = 0; i < userIds.length; i += 10) {
      let ids = [];
      for (let j = i; j < Math.min(userIds.length, i + 10); j++) {
        ids.push(userIds[j]);
      }
      let obs = this.firestore.collection<Account>('users', ref => ref.where('id', 'in', ids)).valueChanges();
      obsList.push(obs);
    }
    return merge(...obsList);
  }

  overwriteAccount(accountKey: string, newData): Promise<void> {
    let accountDoc = this.firestore.collection('users').doc(accountKey);
    return accountDoc.set(newData);
  }

  sendUpdatePasswordEmail(email: string) {
    var auth = firebase.auth();
    var emailAddress = email;
    return auth.sendPasswordResetEmail(emailAddress);
  }

  getAccountFromId(id: string): Observable<any> {
    return this.firestore.collection('users').doc(id).valueChanges();
  }

  getPicDownload(path: string): Observable<any> {
    return this.storage.ref(path).getDownloadURL();
  }

  addCookie(userId: string): Promise<string> {
    return this.firestore.collection('cookie').add({ userId })
      .then((doc) => {
        return doc.id;
      });
  }

  deleteCookie(id: string) {
    this.firestore.collection('cookie').doc(id).delete();
  }

  deleteAccount(accountKey: string): Promise<void> {
    let accountDoc = this.firestore.collection('users').doc(accountKey);
    let promise = accountDoc.delete().then(
      (res) => {
        var user = firebase.auth().currentUser;
        user.delete();
      }
    );
    return promise;
  }

  requestFriend(senderId: string, recipientId: string): Promise<void> {
    let friendship: Friendship = {
      id: '',
      recieveUser: recipientId,
      firstId: senderId,
      secondId: recipientId,
      request: true
    };
    return this.firestore.collection('friendship').add(friendship)
      .then((doc) => {
        this.firestore.collection('friendship').doc(doc.id).update({'id': doc.id});
      })
  }

  confirmFriendRequest(friendshipId: string): Promise<void> {
    return this.firestore.collection('friendship').doc(friendshipId)
      .update({'recieveUser': null, 'request': false});
  }

  removeFriendship(friendshipId: string): Promise<void> {
    return this.firestore.collection('friendship').doc(friendshipId).delete();
  }

  getFriendRequests(userId: string): Observable<Friendship[]> {
    return this.firestore.collection<Friendship>('friendship', ref => ref.where('recieveUser', '==', userId)).valueChanges();
  }

  searchProfiles(username: string): Observable<Account[]> {
    return this.firestore.collection<Account>('users', ref => ref.orderBy("username").startAt(username.toLowerCase())
      .endAt(username.toLowerCase()+"\uf8ff").limit(10)).valueChanges();
  }

}
