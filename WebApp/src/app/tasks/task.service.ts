import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../shared/model/task';
import { AccountService } from '../users/account.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore, private accountService: AccountService) {}

  getTasksForUser(username: string, level: number): Observable<any[]> {
    return this.firestore.collection('tasks', ref => ref.where('creatorUsername', '==', username)
      .where('level', '==', level)).valueChanges();
  }

  // likely need the account service to get the account for the user and then add the id to the list
  // tasks need to store their id so we can distinguish between them
  addTask(task): Promise<void> {
    var firestore = this.firestore;
    return this.firestore.collection('tasks').add(task)
      .then(function(doc) {
        firestore.collection('tasks').doc(doc.id).update({'id': doc.id});
      });
  }

  deleteTask(taskId: string): Promise<void> {
    let taskDoc = this.firestore.collection('tasks').doc(taskId);
    return taskDoc.delete();
  }

  editTask(taskId: string, newData): Promise<void> {
    let taskDoc = this.firestore.collection('tasks').doc(taskId);
    return taskDoc.update(newData);
  }

  resolveTask(taskId: string) {
    this.editTask(taskId, {'dateCompleted': new Date()})
  }

}
