import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Comment } from '../shared/model/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private firestore: AngularFirestore) { }

  getCommentsForTask(taskId: string): Observable<Comment[]> {
    return this.firestore.collection<Comment>('comments', ref => ref.where('taskId', '==', taskId)).valueChanges();
  }

  addComment(comment: Comment): Promise<any> {
    return this.firestore.collection('comments').add(comment);
  }

  deleteComment(commentId: string): Promise<any> {
    return this.firestore.collection('comments').doc(commentId).delete();
  }

}
