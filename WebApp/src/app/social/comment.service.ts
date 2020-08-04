import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private firestore: AngularFirestore) { }

  getCommentsForTask(taskId: string): Observable<any[]> {
    return this.firestore.collection('comments', ref => ref.where('taskId', '==', taskId)).valueChanges();
  }

  addComment(comment): Promise<any> {
    return this.firestore.collection('comments').add(comment);
  }

}
