import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private firestore: AngularFirestore) { 
  }

  createAccount(account: Account) {
    return this.firestore.collection('users').add(account);
  }

  getAllAccounts() : Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }

  getAccount(username: string) : Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('username', '==', username)).valueChanges();
  }

}
